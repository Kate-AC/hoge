import { FirebaseClient } from 'infrastructure/firebase/firebase.client'
import { setDoc, getDoc, doc } from 'firebase/firestore'
import { TwitterAuthParams } from 'infrastructure/session'

export interface TemporaryTokenRepositoryInterface {
    save(params: TwitterAuthParams): Promise<void>
    find(oauthToken: string): Promise<TwitterAuthParams | null>
}

export class TemporaryTokenRepository implements TemporaryTokenRepositoryInterface {

    constructor(private readonly firebaseClient: FirebaseClient = new FirebaseClient) {}

    async save(params: TwitterAuthParams): Promise<void> {
        const ref = doc(this.firebaseClient.firestore, 'temporary_tokens', params.oauthToken)
        const paramsJson = JSON.parse(JSON.stringify(params))

        return setDoc(ref, paramsJson)
    }

    async find(oauthToken: string): Promise<TwitterAuthParams | null> {
        const ref = doc(this.firebaseClient.firestore, 'temporary_tokens', oauthToken)
        const docSnap = await getDoc(ref)

        if (!docSnap.exists()) return null

        return JSON.parse(JSON.stringify(docSnap.data()))
    }
}
