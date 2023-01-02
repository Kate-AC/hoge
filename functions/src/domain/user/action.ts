import { TwitterAccountId } from 'domain/twitter/tweet'
import { ConvertibleRef } from 'domain/user/user'

export type ActionType = 'follow' | 'like' | 'retweet'

export type ActionVOProps = {

    type?: ActionType
    tweetId?: string
    consumedAt?: Date
    createdAt: Date
}

export type ActionEntityProps = {

    targetUser: ConvertibleRef
}

export type ActionProps = ActionVOProps & ActionEntityProps

export interface ActionInterface extends ActionProps {

    targetUser: ConvertibleRef

    consume(): void
    consumed(): boolean
}

export type Actions = { [key: TwitterAccountId]: ActionInterface[] }

export class ActionVO {

    readonly type: ActionType
    readonly tweetId: string
    readonly consumedAt: Date
    readonly createdAt: Date

    constructor(props: ActionVOProps) {
        this.type = props.type
        this.tweetId = props.tweetId ?? null
        this.consumedAt = props.consumedAt ?? null
        this.createdAt = props.createdAt
    }
}

/*
 * オーナーのページに入る度に取り直される
 * 例えばいいね解除した場合、使用していなければAction自体が物理削除されるが、
 * userdAtが入っている場合は削除されない
 */
class ActionEntity extends ActionVO {

    readonly targetUser: ConvertibleRef

    constructor(props: ActionProps) {
        super(props as ActionVOProps)
        this.targetUser = props.targetUser
    }

    consume() {
        Object.assign(this, { consumedAt: new Date()})
    }
}

export class FollowAction extends ActionEntity implements ActionInterface {

    constructor(props: ActionProps) {
        super(Object.assign(props, { type: 'follow' }))
    }

    consumed(): boolean {
        return false
    }
}

export class LikeAction extends ActionEntity implements ActionInterface {

    constructor(props: ActionProps) {
        super(Object.assign(props, { type: 'like' }))
    }

    consumed(): boolean {
        return this.consumedAt != null
    }
}

export class ReTweetAction extends ActionEntity implements ActionInterface {

    constructor(props: ActionProps) {
        super(Object.assign(props, { type: 'retweet' }))
    }

    consumed(): boolean {
        return this.consumedAt != null
    }
}