import { User } from 'domain/user/user'
import { Owner } from 'domain/owner/owner'
import { FollowAction, LikeAction, ReTweetAction } from 'domain/user/action'
import { Content } from 'domain/owner/content'
import { defaultWeightSettings } from 'domain/owner/weight.settings'

describe('Content', () => {

    const generateOwner = (): Owner => {
        const user = new User({
            accountId: '111',
            twitterId: 'twitterId111',
            displayName: 'NomalUser',
            icon: 'hogehoge.jpg',
            contractPlan: 'free',
            actions: {},
            createdAt: new Date
        })

        return new Owner({
            accountId: '111',
            user: user,
            weightSettings: defaultWeightSettings(),
            contents: [],
        })
    }

    it('constructor', () => {
        let owner = generateOwner()
        let content = new Content({
            id: 'contentuuid',
            owner: owner,
            cost: 1,
            expiresAt: null,
            createdAt: new Date
        })

        expect(content instanceof Content).toBeTruthy()
    })

    it('expired', () => {
        let owner = generateOwner()
        let content = new Content({
            id: 'contentuuid',
            owner: owner,
            cost: 1,
            expiresAt: null,
            createdAt: new Date
        })

        expect(content.expired()).toBeFalsy()

        content.setExpiresAt(new Date())

        expect(content.expired()).toBeTruthy()
    })

    it('isNoCost', () => {
        let owner = generateOwner()
        let content = new Content({
            id: 'contentuuid',
            owner: owner,
            cost: 1,
            expiresAt: null,
            createdAt: new Date
        })

        expect(content.isNoCost()).toBeFalsy()

        content.setCost(0)

        expect(content.isNoCost()).toBeTruthy()
    })

    it('bringConsumerPoint', async () => {
        let owner = generateOwner()

        const actions = {}
        actions[owner.accountId] = [
            new ReTweetAction({
                targetUser: owner,
                tweetId: 'tweetid1',
                consumedAt: new Date,
                createdAt: new Date
            }),
            new FollowAction({
                targetUser: owner,
                consumedAt: (() => {
                    const date = new Date
                    date.setDate(date.getDate() - 70)
                    return date
                })(),
                createdAt: new Date
            }),
            new LikeAction({
                targetUser: owner,
                tweetId: 'tweetid3',
                createdAt: new Date
            }),
            new ReTweetAction({
                targetUser: owner,
                tweetId: 'tweetid4',
                createdAt: new Date
            }),
            new LikeAction({
                targetUser: owner,
                tweetId: 'tweetid5',
                createdAt: new Date
            }),
            new ReTweetAction({
                targetUser: owner,
                tweetId: 'tweetid6',
                createdAt: new Date
            }),
        ]

        const fractionPoints = {}
        fractionPoints[owner.accountId] = 0

        const user = new User({
            accountId: '111',
            twitterId: 'twitterId111',
            displayName: 'NomalUser',
            icon: 'hogehoge.jpg',
            contractPlan: 'free',
            actions: actions,
            fractionPoints: fractionPoints,
            createdAt: new Date
        })

        let content = new Content({
            id: 'contentuuid',
            owner: owner,
            cost: 13,
            expiresAt: null,
            createdAt: new Date
        })

        expect(owner.extractValidTotalPoint(
            actions[owner.accountId],
            user.fractionPoints[owner.accountId]
        )).toBe(22)

        await content.bringConsumerPoint(user)

        expect(user.fractionPoints[owner.accountId]).toBe(3)
        expect(owner.extractValidTotalPoint(
            actions[owner.accountId],
            user.fractionPoints[owner.accountId]
        )).toBe(9)
    })
})
