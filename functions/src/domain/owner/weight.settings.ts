export type FollowWeightIntervalType = 'daily' | 'weekly' | 'monthly'

export type WeightSettingsProps = {
    followWeight: number
    followWeightInterval: FollowWeightIntervalType
    likeWeight: number
    retweetWeight: number
}

/**
 * ユーザーが自分で設定できるようにする可能性あり
 */
 export class WeightSettings {

    readonly followWeight: number
    readonly followWeightInterval: FollowWeightIntervalType
    readonly likeWeight: number
    readonly retweetWeight: number

    constructor(props: WeightSettingsProps) {
        Object.assign(this, props)
    }
}

export function defaultWeightSettings() {
    return new WeightSettings({
        followWeight: 1,
        followWeightInterval: 'weekly',
        likeWeight: 1,
        retweetWeight: 5
    })
}
