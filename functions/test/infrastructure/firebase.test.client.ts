import * as firebase from '@firebase/rules-unit-testing'
import { FirebaseApp } from 'firebase/app'
import { FirebaseClientInterface } from 'infrastructure/firebase/firebase.client'
import { Firestore } from 'firebase/firestore'
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth'

export class FirebaseTestClient implements FirebaseClientInterface {

    app: FirebaseApp
    db: Firestore
    auth: Auth

    static instance?: FirebaseTestClient

    private testEnv?: firebase.RulesTestEnvironment = null

    async createClient(): Promise<FirebaseTestClient> {
        if (FirebaseTestClient.instance) {
            return FirebaseTestClient.instance
        }

        const projectId = `test-${Date.now()}`

        this.testEnv = await firebase.initializeTestEnvironment({
            projectId: projectId,
            firestore: {
                host: 'firebase',
                port: 8080
            },
            
        })

        //this.auth = getAuth(this.app)
        //connectAuthEmulator(this.auth, 'http://firebase:9099')

        const unauthenticatedContext = this.testEnv.unauthenticatedContext()
        this.db = (unauthenticatedContext.firestore() as unknown) as Firestore
        FirebaseTestClient.instance = this

        return this
    }

    async clearFirestore(): Promise<void> {
        await this.testEnv?.clearFirestore()
    }
}
