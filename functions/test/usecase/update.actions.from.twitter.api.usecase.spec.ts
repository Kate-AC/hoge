import { UpdateActionsFromTwitterApiUsecase, UpdateActionsFromTwitterApiUsecaseInterface } from 'usecase/update.actions.from.twitter.api.usecase'
import { TwitterRepositoryInterface } from 'domain/twitter/twitter.repository.interface'
import { Tweet, TwitterAccountId } from 'domain/twitter/tweet'
import { TwitterUser } from 'domain/twitter/twitter.user'
import { User } from 'domain/user/user'
import { ConvertibleRefOwner } from 'domain/owner/owner'
import { UserRepository } from 'infrastructure/user.repository'
import { FirebaseTestClient } from '../infrastructure/firebase.test.client'
import { ConvertTweetToActionUsecase } from 'usecase/convert.tweet.to.action.usecase'
import { LikeAction, ReTweetAction, FollowAction } from 'domain/user/action'

describe('UpdateActionsFromTwitterApiUsecase', () => {

    class TwitterRepositoryMock implements TwitterRepositoryInterface {

        async fetchLikesByAccountId(_: TwitterAccountId): Promise<Tweet[]> {
            return [
                new Tweet({tweetId: 'aaa', accountId: '111', createdAt: new Date}),
                new Tweet({tweetId: 'bbb', accountId: '111', createdAt: new Date}),
                new Tweet({tweetId: 'ccc', accountId: '111', createdAt: new Date}),
                new Tweet({tweetId: 'ddd', accountId: '111', createdAt: new Date}),
                new Tweet({tweetId: 'eee', accountId: '111', createdAt: new Date}),
                new Tweet({tweetId: 'fff', accountId: '111', createdAt: new Date}),
                new Tweet({tweetId: 'ggg', accountId: '111', createdAt: new Date}),
                new Tweet({tweetId: 'hhh', accountId: '222', createdAt: new Date}),
                new Tweet({tweetId: 'iii', accountId: '333', createdAt: new Date})
            ]
        }

        async fetchRetweetsByAccountId(_: TwitterAccountId): Promise<Tweet[]> {
            return [
                new Tweet({tweetId: 'AAA', accountId: '111', createdAt: new Date}),
                new Tweet({tweetId: 'BBB', accountId: '111', createdAt: new Date}),
                new Tweet({tweetId: 'CCC', accountId: '111', createdAt: new Date}),
                new Tweet({tweetId: 'DDD', accountId: '222', createdAt: new Date}),
                new Tweet({tweetId: 'EEE', accountId: '333', createdAt: new Date}),
            ]
        }

        async fetchOneUserByTwitterId(_: string): Promise<TwitterUser | null> {
            return new TwitterUser({accountId: '12345', twitterId: 'testtaro', displayName: 'テスト太郎'})
        }

        async fetchFollowingsByAccountId(_: TwitterAccountId): Promise<TwitterUser[]> {
            return [
                new TwitterUser({accountId: '111', twitterId: 'userhanako', displayName: 'ユーザー花子'}),
                new TwitterUser({accountId: '222', twitterId: 'userziro', displayName: 'ユーザー次郎'}),
                new TwitterUser({accountId: '333', twitterId: 'usersaburo', displayName: 'ユーザー三郎'}),
            ]
        }
    }

    let client: FirebaseTestClient
    let userRepository: UserRepository
    let usecase: UpdateActionsFromTwitterApiUsecaseInterface

    beforeAll(async () => {
        client = new FirebaseTestClient
        await client.createClient()
        userRepository = new UserRepository(client)
    })

    beforeEach(async () => {
        await (new FirebaseTestClient).clearFirestore()

        const defaultUser = new User({
            accountId: '000',
            twitterId: 'owner0',
            displayName: 'ユーザー0',
            icon: 'hogehoge.jpg',
            contractPlan: 'free',
            actions: {
                '111': [
                    new LikeAction({
                        targetUser: new ConvertibleRefOwner('111'),
                        tweetId: 'aaa',
                        consumedAt: null,
                        createdAt: new Date
                    }),
                    new LikeAction({
                        targetUser: new ConvertibleRefOwner('111'),
                        tweetId: 'ccc',
                        consumedAt: null,
                        createdAt: new Date
                    }),
                    new ReTweetAction({
                        targetUser: new ConvertibleRefOwner('111'),
                        tweetId: 'AAA',
                        consumedAt: null,
                        createdAt: new Date
                    }),
                    new FollowAction({
                        targetUser: new ConvertibleRefOwner('111'),
                        tweetId: null,
                        consumedAt: null,
                        createdAt: new Date
                    })
                ]
            },
            createdAt: new Date
        })

        await userRepository.save(defaultUser)
        await userRepository.saveActions(defaultUser, '111')

        usecase = new UpdateActionsFromTwitterApiUsecase(
            new TwitterRepositoryMock(),
            userRepository,
            new ConvertTweetToActionUsecase
        )
    })

    it('fetchNewLikeTweetsFromTwitterApi', async () => {
        const likeTweets = await usecase.fetchNewLikeTweetsFromTwitterApi('000')
        expect(likeTweets.length).toBe(7)
        expect(likeTweets[0].tweetId).toBe('bbb')
        expect(likeTweets[1].tweetId).toBe('ddd')
    })

    it('fetchNewRetweetsFromTwitterApi', async () => {
        const retweets = await usecase.fetchNewRetweetsFromTwitterApi('000')
        expect(retweets.length).toBe(4)
        expect(retweets[0].tweetId).toBe('BBB')
    })

    it('fetchNewFollowingsFromTwitterApi', async () => {
        const followers = await usecase.fetchNewFollowingsFromTwitterApi('000')
        expect(followers.length).toBe(2)
        expect(followers[0].accountId).toBe('222')
    })

    it('fetchNewActions', async () => {
        const actions = await usecase.fetchNewActions('000')
        expect(actions).toBeTruthy()
    })

    it('flattenAccountId', async () => {
        const tweets = [
            new Tweet({tweetId: 'aaa', accountId: '111', createdAt: new Date}),
            new Tweet({tweetId: 'bbb', accountId: '111', createdAt: new Date}),
            new Tweet({tweetId: 'ccc', accountId: '222', createdAt: new Date}),
            new Tweet({tweetId: 'ddd', accountId: '111', createdAt: new Date})
        ]
        const accountIds = await usecase.flattenAccountId(tweets)
        expect(accountIds[0]).toBe('111')
        expect(accountIds[1]).toBe('222')
    })

    it('fetchActions', async () => {
        const likeActions = await usecase.fetchActions('000', ['111', '222', '333'], 'like')
        expect(likeActions.length).toBe(2)
        await Promise.all(likeActions.map(likeAction => {
            expect(likeAction.type).toBe('like')
        }))

        const retweetActions = await usecase.fetchActions('000', ['111', '222', '333'], 'retweet')
        expect(retweetActions.length).toBe(1)
        await Promise.all(retweetActions.map(retweetAction => {
            expect(retweetAction.type).toBe('retweet')
        }))

        const followActions = await usecase.fetchActions('000', ['111', '222', '333'], 'follow')
        expect(followActions.length).toBe(1)
        await Promise.all(followActions.map(followAction => {
            expect(followAction.type).toBe('follow')
        }))
    })

    it('updateActions', async () => {
        let actions = await userRepository.findActions('000', '111')
        expect(actions.length).toBe(4)

        await usecase.updateActions('000')

        actions = await userRepository.findActions('000', '111')
        expect(actions.length).toBe(11)
    })
})