import { TwitterAccountId } from 'domain/twitter/tweet'
import { v4 as uuidv4 } from 'uuid'
import { TwitterApi, TweetV2, UserV2 } from 'twitter-api-v2'
import { DateGenerator } from 'util/date.generator'
import { AccessTokenVO } from 'infrastructure/access.token.repository'

export type TwitterAuthLink = {
    oauthToken: string
    oauthTokenSecret: string
    oauthCallbackConfirmed: string;
    url: string;
}

export interface TwitterApiClientInterface {
    createAuthClient(accessToken?: string, accessSecret?: string): TwitterApiClientInterface
    loginWithGenerateAccessToken(oauthVerifier: string): Promise<AccessTokenVO>
    findLikedTweetsByAccountId(accountId: TwitterAccountId): Promise<TweetV2[]>
    findReTweetsByAccountId(accountId: TwitterAccountId): Promise<TweetV2[]>
    findOneUserByTwitterId(twitterId: string): Promise<UserV2>
    findFollowingsByAccountId(accountId: TwitterAccountId): Promise<UserV2[]>
    createAuthLink(): Promise<TwitterAuthLink>
}

export class TwitterApiClient extends TwitterApi implements TwitterApiClientInterface {

    private BREAK_FETCHED_COUNT = 10

    createAuthClient(accessToken?: string, accessSecret?: string): TwitterApiClientInterface {
        return new TwitterApiClient({
            appKey: process.env.TWITTER_APP_KEY,
            appSecret: process.env.TWITTER_APP_SECRET,
            accessToken: accessToken ?? process.env.TWITTER_ACCESS_TOKEN,
            accessSecret: accessSecret ?? process.env.TWITTER_ACCESS_SECRET
        })
    }

    async createAuthLink(): Promise<TwitterAuthLink> {
        const result = await this.generateAuthLink(
            process.env.TWITTER_AUTH_CALLBACK,
            { 
                linkMode: 'authorize',
                forceLogin: false // アカウントの選択をさせるかどうか
            }
        )

        return {
            oauthToken: result.oauth_token,
            oauthTokenSecret: result.oauth_token_secret,
            oauthCallbackConfirmed: result.oauth_callback_confirmed,
            url: result.url
        }
    }

    async loginWithGenerateAccessToken(oauthVerifier: string): Promise<AccessTokenVO> {
        const { client: loggedClient, accessToken, accessSecret } = await this.login(oauthVerifier)
        const { data } = await loggedClient.v2.me()

        return new AccessTokenVO({
            uid: uuidv4(),
            accountId: data.id as TwitterAccountId,
            accessToken,
            accessSecret,
            expiresIn: DateGenerator.getDate1DayLater()
        })
    }

    // 取れる配列は日付順ではなくいいねを押した順なので日付で区切れない
    async findLikedTweetsByAccountId(accountId: TwitterAccountId): Promise<TweetV2[]> {
        let paginator = await this.v2.userLikedTweets(accountId, {
            max_results: 100,
            expansions: ['author_id'],
            'tweet.fields': ['created_at']
        });

        const tweets = []
        let counter = 1

        while (!paginator.done) {
            await paginator.fetchNext();
            counter++
            tweets.push(...paginator.data.data)

            if (counter >= this.BREAK_FETCHED_COUNT) {
                break
            }
        }

        return tweets
    }

    async findReTweetsByAccountId(accountId: TwitterAccountId): Promise<TweetV2[]> {
        const paginator = await this.v2.userTimeline(accountId as string, {
            max_results: 100,
            start_time: DateGenerator.getDate1WeekAgo().toISOString(),
            expansions: ['referenced_tweets.id'],
            'tweet.fields': ['author_id', 'referenced_tweets', 'created_at'],
        })

        const tweets = []
        let counter = 1
        tweets.push(...paginator.includes.tweets)

        while (!paginator.done) {
            await paginator.fetchNext();
            counter++
            tweets.push(...paginator.includes.tweets)

            if (counter >= this.BREAK_FETCHED_COUNT) {
                break
            }
        }

        return tweets
    }

    async findOneUserByTwitterId(twitterId: string): Promise<UserV2> {
        const result = await this.v2.userByUsername(twitterId)
        return result.data
    }

    async findFollowingsByAccountId(accountId: TwitterAccountId): Promise<UserV2[]> {
        const paginator = await this.v2.following(accountId, {
            asPaginator: true,
            max_results: 1000
        })

        const followings = []
        let counter = 1
        followings.push(...paginator.data.data)

        while (!paginator.done) {
            await paginator.fetchNext();
            counter++
            followings.push(...paginator.data.data)

            if (counter >= this.BREAK_FETCHED_COUNT) {
                break
            }
        }

        return followings
    }
}
