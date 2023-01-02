import { User } from "domain/user/user"
import { Owner } from "domain/owner/owner"
import { defaultWeightSettings } from "domain/owner/weight.settings"
import { FirebaseTestClient } from "./firebase.test.client"
import { UserRepository } from "infrastructure/user.repository"
import { LikeAction } from 'domain/user/action'

describe('UserRepository', () => {

    let client: FirebaseTestClient
    let userRepository: UserRepository

    const generateUser = (): User => {
        return new User({
            accountId: '111',
            twitterId: 'xxxdisplayId',
            displayName: 'TestUser',
            icon: 'hogehoge.jpg',
            contractPlan: 'free',
            fractionPoints: {},
            actions: {},
            releasedContentIds: [],
            createdAt: new Date
        })
    }

    const generageConvartibleRefUser = (): Owner => {
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

    beforeEach(async () => {
        client = new FirebaseTestClient
        userRepository = new UserRepository(await client.createClient())
    })

    it('add and find', async () => {
        const user = generateUser()

        expect(await userRepository.save(user)).toBeTruthy()
        expect(await userRepository.find(user.accountId)).toBeTruthy()
    })

    it('update and find', async () => {
        const user = generateUser()

        userRepository.save(user)
        expect((await userRepository.find(user.accountId)).displayName).toBe('TestUser')

        const updateUser = Object.assign(user, { displayName: 'updated' })

        expect(await userRepository.save(updateUser)).toBeTruthy()
        expect((await userRepository.find(user.accountId)).displayName).toBe('updated')
    })

    it('addActions and find and update', async () => {
        const targetUser = generageConvartibleRefUser()
        const actions = {}
        actions[targetUser.accountId] = [
            new LikeAction({tweetId: 'a1111', createdAt: new Date, targetUser: targetUser}),
            new LikeAction({tweetId: 'a2222', createdAt: new Date, targetUser: targetUser}),
        ]
        const user = Object.assign(generateUser(), { actions: actions })

        expect(await userRepository.saveActions(user, targetUser.accountId)).toBeTruthy()

        const resultActions = await userRepository.findActions(user.accountId, targetUser.accountId)
        expect(resultActions.length).toBe(2)

        user.actions[targetUser.accountId].push(
            new LikeAction({tweetId: 'a3333', createdAt: new Date, targetUser: targetUser})
        )
        expect(await userRepository.saveActions(user, targetUser.accountId)).toBeTruthy()
        const updatedActions = await userRepository.findActions(user.accountId, targetUser.accountId)
        expect(updatedActions.length).toBe(3)
    })
})
