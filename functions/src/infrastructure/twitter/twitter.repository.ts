import { Tweet, TwitterAccountId } from 'domain/twitter/tweet'
import { TwitterUser } from 'domain/twitter/twitter.user'
import { TwitterRepositoryInterface } from 'domain/twitter/twitter.repository.interface'
import { TwitterApiClient } from 'infrastructure/twitter/twitter.api.client'
import { DateGenerator } from 'util/date.generator'

export class TwitterRepository implements TwitterRepositoryInterface {

    readonly client: TwitterApiClient

    constructor(client: TwitterApiClient) {
        this.client = client
    }

    async fetchLikesByAccountId(accountId: TwitterAccountId): Promise<Tweet[]> {
        const likeTweets = await this.client.findLikedTweetsByAccountId(accountId)

        // 現在は7日間以前は無視するが、いずれ7日間以前の枠は無くなる可能性はある
        const date1WeekAgo = DateGenerator.getDate1WeekAgo()
        const within7DaysTweet = await Promise.all(likeTweets.filter(likeTweet => {
            return date1WeekAgo <= new Date(likeTweet.created_at)
        }))

        return await Promise.all(within7DaysTweet.map((tweet) => new Tweet({
            tweetId: tweet.id,
            accountId: tweet.author_id as TwitterAccountId,
            createdAt: new Date(tweet.created_at)
        })))
    }

    async fetchRetweetsByAccountId(accountId: TwitterAccountId): Promise<Tweet[]> {
        const retweets = await this.client.findReTweetsByAccountId(accountId)

        const date1WeekAgo = DateGenerator.getDate1WeekAgo()
        const within7DaysTweet = await Promise.all(retweets.filter(retweet => {
            return date1WeekAgo <= new Date(retweet.created_at)
        }))

        return await Promise.all(within7DaysTweet.map((tweet) => new Tweet({
            tweetId: tweet.id,
            accountId: tweet.author_id as TwitterAccountId,
            createdAt: new Date(tweet.created_at)
        })))
    }

    async fetchOneUserByTwitterId(twitterId: string): Promise<TwitterUser | null> {
        const result = await this.client.findOneUserByTwitterId(twitterId)

        if (result === undefined) return null

        return new TwitterUser({
            accountId: result.id as TwitterAccountId,
            displayName: result.name,
            twitterId: result.username
        })
    }

    async fetchFollowingsByAccountId(accountId: TwitterAccountId): Promise<TwitterUser[]> {
        const followings = await this.client.findFollowingsByAccountId(accountId)

        return await Promise.all(followings.map((following) => new TwitterUser({
            accountId: following.id as TwitterAccountId,
            displayName: following.name,
            twitterId: following.username
        })))
    }
}
