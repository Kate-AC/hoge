import { User } from 'domain/user/user'
import { Owner } from 'domain/owner/owner' 
import { FollowAction, LikeAction, ReTweetAction } from 'domain/user/action'
import { defaultWeightSettings } from 'domain/owner/weight.settings'

describe('Owner', () => {

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
        expect(owner instanceof Owner).toBeTruthy()
    })

    it('extractValidTotalPoint like', () => {
        const owner = generateOwner()
        const actions = [
            new LikeAction({
                targetUser: owner,
                tweetId: 'tweetid1',
                createdAt: new Date
            }),
            new LikeAction({
                targetUser: owner,
                tweetId: 'tweetid2',
                consumedAt: new Date,
                createdAt: new Date
            })
        ]

        expect(owner.extractValidTotalPoint(actions, 0)).toBe(1)
    })

    it('extractValidTotalPoint retweet', () => {
        const owner = generateOwner()
        const actions = [
            new ReTweetAction({
                targetUser: owner,
                tweetId: 'tweetid1',
                createdAt: new Date
            }),
            new ReTweetAction({
                targetUser: owner,
                tweetId: 'tweetid2',
                consumedAt: new Date(),
                createdAt: new Date
            })
        ]

        expect(owner.extractValidTotalPoint(actions, 0)).toBe(5)
    })

    it('extractValidTotalPoint follow 7week ago', () => {
        const owner = generateOwner()
        const actions = [
            new FollowAction({
                targetUser: owner,
                tweetId: 'tweetid1',
                consumedAt: (() => {
                    const date = new Date
                    date.setDate(date.getDate() - 70)
                    return date
                })(),
                createdAt: new Date
            })
        ]

        expect(owner.extractValidTotalPoint(actions, 0)).toBe(10)
    })

    it('extractValidTotalPoint follow now', () => {
        const owner = generateOwner()
        const actions = [
            new FollowAction({
                targetUser: owner,
                tweetId: 'tweetid1',
                consumedAt: new Date(),
                createdAt: new Date
            })
        ]

        expect(owner.extractValidTotalPoint(actions, 0)).toBe(0)
    })
})
