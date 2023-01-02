import { TwitterAccountId } from 'domain/twitter/tweet'
import { Actions, ActionInterface, LikeAction } from 'domain/user/action'

export type ContractPlanType = 'free' | 'pro' | 'premium' | 'special'

export type FractionPoints = { [key: TwitterAccountId]: number }

export type ConvertibleRefProps = {
    accountId: TwitterAccountId
}

export type UserVOProps = {
    twitterId: string
    displayName: string
    icon: string
    contractPlan: ContractPlanType
    fractionPoints?: FractionPoints
    releasedContentIds?: TwitterAccountId[]
    createdAt: Date
}

export type OwnerEntityProps = ConvertibleRefProps & {
    actions?: Actions
}

export type UserProps = UserVOProps & OwnerEntityProps

export interface ConvertibleRef {

    accountId: TwitterAccountId

    getCollectionName(): string
    getDocumentId(): string
}

export class UserVO {

    readonly twitterId: string
    readonly displayName: string
    readonly icon: string
    readonly contractPlan: ContractPlanType
    readonly fractionPoints: FractionPoints // 変換済みの端数
    readonly releasedContentIds: TwitterAccountId[] = []
    readonly createdAt: Date

    constructor(props: UserVOProps) {
        this.twitterId = props.twitterId
        this.displayName = props.displayName
        this.icon = props.icon
        this.contractPlan = props.contractPlan
        this.fractionPoints = props.fractionPoints ?? {}
        this.releasedContentIds = props.releasedContentIds ?? []
        this.createdAt = new Date
    }
}

export class ConvertibleRefUser implements ConvertibleRef {

    constructor(readonly accountId: TwitterAccountId) {}

    getCollectionName(): string {
        return 'users'
    }

    getDocumentId(): string {
        return this.accountId
    }
}

export class User extends UserVO implements ConvertibleRef {

    readonly accountId: TwitterAccountId
    readonly actions: Actions

    constructor(props: UserProps) {
        super(props as UserVOProps)
        this.accountId = props.accountId
        this.actions = props.actions ?? {}
    }

    async addAction(action: any) {
        const targetAccountId = action.targetUser.accountId

        if (this.actions[targetAccountId] === undefined) {
            this.actions[targetAccountId] = []
        }

        this.actions[targetAccountId].unshift(action)
    }

    async addActions(actions: ActionInterface[]) {
        await Promise.all(actions.map(async action => await this.addAction(action)))
    }

    async setActions(accountId: TwitterAccountId, actions: ActionInterface[]) {
        this.actions[accountId] = actions
    }

    setFractionPoint(accountId: TwitterAccountId, fractionPoint: number) {
        this.fractionPoints[accountId] = fractionPoint
    }

    // ConvertibleUserRef

    getCollectionName(): string {
        return 'users'
    }

    getDocumentId(): string {
        return this.accountId
    }
}
