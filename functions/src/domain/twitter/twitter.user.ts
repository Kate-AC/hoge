import { TwitterAccountId } from "domain/twitter/tweet"

export type TwitterUserProps = {
    accountId: TwitterAccountId
    twitterId: string
    displayName: string
}

export class TwitterUser {

    readonly accountId: TwitterAccountId
    readonly twitterId: string
    readonly displayName: string

    constructor(props: TwitterUserProps) {
        this.accountId = props.accountId
        this.twitterId = props.twitterId
        this.displayName = props.displayName
    }
}