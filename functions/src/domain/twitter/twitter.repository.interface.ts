import { Tweet, TwitterAccountId } from 'domain/twitter/tweet'
import { TwitterUser } from 'domain/twitter/twitter.user'

export interface TwitterRepositoryInterface {

    fetchLikesByAccountId(accountId: TwitterAccountId): Promise<Tweet[]>
    fetchRetweetsByAccountId(accountId: TwitterAccountId): Promise<Tweet[]>
    fetchOneUserByTwitterId(twitterId: string): Promise<TwitterUser | null>
    fetchFollowingsByAccountId(accountId: TwitterAccountId): Promise<TwitterUser[]>
}