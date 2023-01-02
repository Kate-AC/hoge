import { Owner } from 'domain/owner/owner'
import { User } from 'domain/user/user'

export type ContentVOProps = {

    cost: number
    expiresAt: Date | null
    createdAt: Date
}

export type ContentEntityProps = {
    id: string
    owner: Owner
}

export type ContentProps = ContentVOProps & ContentEntityProps

export class ContentVO {

    readonly cost: number
    readonly expiresAt: Date | null
    readonly createdAt: Date

    constructor(props: ContentVOProps) {
        Object.assign(this, props)
    }
}

export class Content extends ContentVO {

    readonly id: string
    readonly owner: Owner

    constructor(props: ContentProps) {
        super(props as ContentVOProps)
        Object.assign(this, props as ContentEntityProps)
    }

    setExpiresAt(expiresAt: Date) {
        Object.assign(this, { expiresAt: expiresAt })
    }

    expired(): boolean {
        if (this.expiresAt === null) return false

        return (new Date).getTime() >= this.expiresAt.getTime()
    }

    setCost(cost: number) {
        Object.assign(this, { cost: cost })
    }

    isNoCost(): boolean {
        return this.cost < 1
    }

    validate(): boolean {
        if (this.isNoCost()) return false

        return true
    }

    async bringConsumerPoint(customerUser: User) {
        const ownerAccountId = this.owner.accountId
        let convertedPoint = customerUser.fractionPoints[ownerAccountId]
        const actions = customerUser.actions[ownerAccountId]

        // ループが余計に走るのでなんとかしたい
        await Promise.all(actions.map(action => {
            if (action.consumed() || convertedPoint >= this.cost) { return }

            convertedPoint += this.owner.enquirePoint(action)
            action.consume()
        }))

        if (convertedPoint < this.cost) {
            throw Error('Not enough points.')
        }

        customerUser.setFractionPoint(ownerAccountId, convertedPoint - this.cost)
    }
}
