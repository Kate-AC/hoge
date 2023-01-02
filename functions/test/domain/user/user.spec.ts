import { User } from 'domain/user/user'
import { Owner } from 'domain/owner/owner'
import { defaultWeightSettings } from 'domain/owner/weight.settings'
import { ActionInterface, LikeAction } from 'domain/user/action'

type Actions = { TwitterAccountId: ActionInterface[] }

describe('User', () => {

    const generateUser = (actions: Actions): User => {
        return new User({
            accountId: '111',
            twitterId: 'twitterId111',
            displayName: 'NomalUser',
            icon: 'hogehoge.jpg',
            contractPlan: 'free',
            actions: actions,
            createdAt: new Date
        })
    }

    const generateTargetUser = (): Owner => {
        return new Owner({
            accountId: '222',
            user: new User({
                accountId: '222',
                twitterId: 'twitterId222',
                displayName: 'NomalUser',
                icon: 'hogehoge.jpg',
                contractPlan: 'free',
                createdAt: new Date
            }),
            weightSettings: defaultWeightSettings(),
            contents: [],
        })
    }

    it('constructor', () => {
        const user = generateUser({} as Actions)
        expect(user instanceof User).toBeTruthy()
    })

    it('addActions', async () => {
        const user = generateUser({} as Actions)
        const targetUser = generateTargetUser()

        expect(user.actions[targetUser.accountId]).toBe(undefined)

        await user.addActions([
            new LikeAction({
                targetUser: targetUser,
                tweetId: 'aa1',
                createdAt: new Date
            }),
            new LikeAction({
                targetUser: targetUser,
                tweetId: 'aa2',
                createdAt: new Date
            })
        ])

        expect(user.actions[targetUser.accountId].length).toBe(2)
    })

    it('setFractionPoint', async () => {
        const user = generateUser({} as Actions)
        const targetUser = generateTargetUser()

        expect(user.fractionPoints[targetUser.accountId]).toBe(undefined)

        user.setFractionPoint(targetUser.accountId, 4)

        expect(user.fractionPoints[targetUser.accountId]).toBe(4)
    })
})
