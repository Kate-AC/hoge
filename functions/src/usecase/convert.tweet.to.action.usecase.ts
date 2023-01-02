import { FollowAction, LikeAction, ReTweetAction } from 'domain/user/action'
import { Tweet } from 'domain/twitter/tweet'
import { TwitterUser } from 'domain/twitter/twitter.user'
import { ConvertibleRefOwner } from 'domain/owner/owner'

export interface ConvertTweetToActionUsecaseInterface {
    toLikeAction(tweet: Tweet): LikeAction
    toRetweetAction(tweet: Tweet): ReTweetAction
    toFollowAction(twitterUser: TwitterUser): FollowAction
}

export class ConvertTweetToActionUsecase implements ConvertTweetToActionUsecaseInterface {

    toLikeAction(tweet: Tweet): LikeAction {
        return new LikeAction({
            targetUser: new ConvertibleRefOwner(tweet.accountId),
            tweetId: tweet.tweetId,
            consumedAt: null,
            createdAt: tweet.createdAt
        })
    }

    toRetweetAction(tweet: Tweet): ReTweetAction {
        return new ReTweetAction({
            targetUser: new ConvertibleRefOwner(tweet.accountId),
            tweetId: tweet.tweetId,
            consumedAt: null,
            createdAt: tweet.createdAt
        })
    }

    toFollowAction(twitterUser: TwitterUser): FollowAction {
        return new FollowAction({
            targetUser: new ConvertibleRefOwner(twitterUser.accountId),
            tweetId: null,
            consumedAt: null,
            createdAt: new Date
        })
    }
}