
export type TwitterAccountId = `${number}`

export type TweetProps = {
    tweetId: string
    accountId: TwitterAccountId
    createdAt: Date
}

export class Tweet {

    readonly tweetId: string
    readonly accountId: TwitterAccountId
    readonly createdAt: Date

    constructor(props: TweetProps) {
        this.tweetId   = props.tweetId
        this.accountId = props.accountId
        this.createdAt = props.createdAt
    }
}