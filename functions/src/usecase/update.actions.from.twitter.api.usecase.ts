import { ActionInterface, Actions, ActionType } from 'domain/user/action'
import { Tweet, TwitterAccountId } from 'domain/twitter/tweet'
import { TwitterUser } from 'domain/twitter/twitter.user'
import { TwitterRepositoryInterface } from 'domain/twitter/twitter.repository.interface'
import { UserRepositoryInterface } from 'domain/user/user.repository.interface'
import { ConvertTweetToActionUsecaseInterface } from 'usecase/convert.tweet.to.action.usecase'

export interface UpdateActionsFromTwitterApiUsecaseInterface {
    fetchNewLikeTweetsFromTwitterApi(myAccountId: TwitterAccountId): Promise<Tweet[]>
    fetchNewRetweetsFromTwitterApi(myAccountId: TwitterAccountId): Promise<Tweet[]>
    fetchNewFollowingsFromTwitterApi(myAccountId: TwitterAccountId): Promise<TwitterUser[]>
    fetchNewActions(myAccountId: TwitterAccountId): Promise<Actions>
    updateActions(myAccountId: TwitterAccountId): Promise<boolean>
    flattenAccountId(tweets: Tweet[] | TwitterUser[]): Promise<TwitterAccountId[]>
    fetchActions(
        myAccountId: TwitterAccountId,
        targetAccountIds: TwitterAccountId[],
        type: ActionType
    ): Promise<ActionInterface[]>
}

export class UpdateActionsFromTwitterApiUsecase implements UpdateActionsFromTwitterApiUsecaseInterface {

    constructor(
        private readonly twitterRepository: TwitterRepositoryInterface,
        private readonly userRepository: UserRepositoryInterface,
        private readonly convertTweetToActionUsecase: ConvertTweetToActionUsecaseInterface
    ) {}

    async fetchNewLikeTweetsFromTwitterApi(myAccountId: TwitterAccountId): Promise<Tweet[]> {
        const likeTweets       = await this.twitterRepository.fetchLikesByAccountId(myAccountId)
        const targetAccountIds = await this.flattenAccountId(likeTweets)
        const havingActions    = await this.fetchActions(myAccountId, targetAccountIds, 'like')

        // 既に持っているActionが新しいActionになることはないので、現在取れたTweetの内容でループする
        return await Promise.all(likeTweets.filter(likeTweet => {
            // 持っていないということは新しいTweet
            return !havingActions.find(havingAction => havingAction.tweetId === likeTweet.tweetId)
        }))
    }

    async fetchNewRetweetsFromTwitterApi(myAccountId: TwitterAccountId): Promise<Tweet[]> {
        const retweets         = await this.twitterRepository.fetchRetweetsByAccountId(myAccountId)
        const targetAccountIds = await this.flattenAccountId(retweets)
        const havingActions    = await this.fetchActions(myAccountId, targetAccountIds, 'retweet')

        return await Promise.all(retweets.filter(likeTweet => {
            return !havingActions.find(havingAction => havingAction.tweetId === likeTweet.tweetId)
        }))
    }

    async fetchNewFollowingsFromTwitterApi(myAccountId: TwitterAccountId): Promise<TwitterUser[]> {
        const followings       = await this.twitterRepository.fetchFollowingsByAccountId(myAccountId)
        const targetAccountIds = await this.flattenAccountId(followings)
        const havingActions    = await this.fetchActions(myAccountId, targetAccountIds, 'follow')

        return await Promise.all(followings.filter(following => {
            return !havingActions.find(havingAction => {
                return havingAction.targetUser.accountId === following.accountId
            })
        }))
    }

    /**
     * 完全新規のActionのみ追加
     * 既に取得済みの場合は何もしない
     * 連携していない人はOwnerにならないので保存もされない
     * 消費分は残す
     */
    async fetchNewActions(myAccountId: TwitterAccountId): Promise<Actions> {
        const newLikes      = await this.fetchNewLikeTweetsFromTwitterApi(myAccountId)
        const newRetweets   = await this.fetchNewRetweetsFromTwitterApi(myAccountId)
        const newFollowings = await this.fetchNewFollowingsFromTwitterApi(myAccountId)

        const actions = {} as Actions

        await Promise.all(newLikes.map(async (newLike) => {
            actions[newLike.accountId] = actions[newLike.accountId] ?? []
            actions[newLike.accountId].unshift(
                this.convertTweetToActionUsecase.toLikeAction(newLike)
            )
        }))

        await Promise.all(newRetweets.map(async (newRetweet) => {
            actions[newRetweet.accountId] = actions[newRetweet.accountId] ?? []
            actions[newRetweet.accountId].unshift(
                this.convertTweetToActionUsecase.toRetweetAction(newRetweet)
            )
        }))

        await Promise.all(newFollowings.map(async (newFollowing) => {
            actions[newFollowing.accountId] = actions[newFollowing.accountId] ?? []
            actions[newFollowing.accountId].unshift(
                this.convertTweetToActionUsecase.toFollowAction(newFollowing)
            )
        }))

        return actions
    }

    async updateActions(myAccountId: TwitterAccountId): Promise<boolean> {
        const newActions = await this.fetchNewActions(myAccountId)
        const user = await this.userRepository.find(myAccountId)

        await Promise.all(Object.keys(newActions).map(async key => {
            const targetAccountId = key as TwitterAccountId

            await user.addActions([
                ...newActions[targetAccountId],
                ...await this.userRepository.findActions(myAccountId, targetAccountId)
            ])

            await this.userRepository.saveActions(user, targetAccountId)
        }))

        return true
    }

    async flattenAccountId(tweets: Tweet[] | TwitterUser[]): Promise<TwitterAccountId[]> {
        return await Promise.all([...new Set(tweets.map(tweet => tweet.accountId))])
    }

    async fetchActions(
        myAccountId: TwitterAccountId,
        targetAccountIds: TwitterAccountId[],
        type: ActionType
    ): Promise<ActionInterface[]> {
        const eachActions = await Promise.all(targetAccountIds.map(async ownerAccountId => {
            return await this.userRepository.findActions(myAccountId, ownerAccountId, type)
        }))

        return eachActions.flat()
    }
}
