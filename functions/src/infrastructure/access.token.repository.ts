import { FirebaseClient } from 'infrastructure/firebase/firebase.client'
import { setDoc, getDoc, doc } from 'firebase/firestore'
import { TwitterAccountId } from 'domain/twitter/tweet'

export type AccessTokenVOProps = {
    uid: string
    accountId: TwitterAccountId
    accessToken: string
    accessSecret: string
    expiresIn: Date
}

export class AccessTokenVO {
    readonly uid: string
    readonly accountId: TwitterAccountId
    readonly accessToken: string
    readonly accessSecret: string
    readonly expiresIn: Date

    constructor(props: AccessTokenVOProps) {
        Object.assign(this, props)
    }
}

export interface AccessTokenRepositoryInterface {
    save(accessToken: AccessTokenVO): Promise<void>
    find(uid: string): Promise<AccessTokenVO | null>
}

export class AccessTokenRepository {

    constructor(private readonly firebaseClient: FirebaseClient = new FirebaseClient) {}

    async save(accessToken: AccessTokenVO): Promise<void> {
        const ref = doc(this.firebaseClient.firestore, 'access_tokens', accessToken.uid)
        const accessTokenJson = JSON.parse(JSON.stringify(accessToken))

        return setDoc(ref, accessTokenJson)
    }

    async find(uid: string): Promise<AccessTokenVO | null> {
        const ref = doc(this.firebaseClient.firestore, 'access_tokens', uid)
        const docSnap = await getDoc(ref)

        if (!docSnap.exists()) return null

        return new AccessTokenVO(docSnap.data() as AccessTokenVOProps)
    }
}
