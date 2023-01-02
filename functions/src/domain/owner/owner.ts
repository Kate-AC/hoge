import { TwitterAccountId } from 'domain/twitter/tweet'
import { ConvertibleRefProps, User } from 'domain/user/user'
import { WeightSettings } from 'domain/owner/weight.settings'
import { Content } from 'domain/owner/content'
import { ConvertibleRef } from 'domain/user/user'
import { ActionInterface } from 'domain/user/action'

export type OwnerVOProps = {
    weightSettings: WeightSettings
    contents: Content[]
}

export type OwnerEntityProps = ConvertibleRefProps & {
    user: User
}

export type OwnerProps = OwnerVOProps & OwnerEntityProps

export class OwnerVO {

    readonly weightSettings: WeightSettings
    readonly contents: Content[]

    constructor(props: OwnerVOProps) {
        Object.assign(this, props)
    }
}

export class ConvertibleRefOwner implements ConvertibleRef {

    constructor(readonly accountId: TwitterAccountId) {}

    getCollectionName(): string {
        return 'owners'
    }

    getDocumentId(): string {
        return this.accountId
    }
}

export class Owner extends OwnerVO implements ConvertibleRef {

    readonly accountId: TwitterAccountId
    readonly user: User

    constructor(props: OwnerProps) {
        super(props as OwnerVOProps)
        Object.assign(this, props as OwnerEntityProps)
    }

    addContent(content: Content) {
        this.contents.push(content)
    }

    enquirePoint(action: ActionInterface): number {
        switch (action.type) {
        case 'follow':
            let diffMs = (new Date).getTime() - action.consumedAt.getTime()
            // 1000ms * 60秒 * 60分 * 24時間 * 7日
            let weeklySec = 1000 * 60 * 60 * 24 * 7
            // 一旦weekly固定
            return Math.floor(diffMs / weeklySec) * this.weightSettings.followWeight
        case 'like':
            return action.consumedAt === null ? this.weightSettings.likeWeight : 0
        case 'retweet':
            return action.consumedAt === null ? this.weightSettings.retweetWeight : 0
        }
    }

    extractValidTotalPoint(actions: ActionInterface[], fractionPoint: number): number {
        let point = fractionPoint
        actions.map(action => point += this.enquirePoint(action))
        return point
    }

    // ConvertibleUserRef

    getCollectionName(): string {
        return 'owners'
    }

    getDocumentId(): string {
        return this.accountId
    }
}
