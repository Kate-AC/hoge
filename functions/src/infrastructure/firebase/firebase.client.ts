import { initializeApp, FirebaseApp } from 'firebase/app'
import { Firestore, getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth'
import { FirebaseStorage, getStorage, connectStorageEmulator } from 'firebase/storage'

export interface FirebaseClientInterface {

    app: FirebaseApp
    firestore: Firestore
    auth: Auth
    storage: FirebaseStorage
}

export class FirebaseClient implements FirebaseClientInterface {

    readonly app: FirebaseApp
    readonly firestore: Firestore
    readonly auth: Auth
    readonly storage: FirebaseStorage

    private static isEmulatorStarted = false

    static readonly firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
    }

    constructor(props = FirebaseClient.firebaseConfig) {
        this.app = initializeApp(props)
        this.firestore = getFirestore(this.app)
        this.storage = getStorage(this.app)

        if (!FirebaseClient.isEmulatorStarted) {
            connectFirestoreEmulator(
                this.firestore,
                process.env.FIRESTORE_DOMAIN,
                process.env.FIRESTORE_PORT as undefined as number
            )

            connectStorageEmulator(
                this.storage,
                process.env.STORAGE_DOMAIN,
                process.env.STORAGE_PORT as undefined as number
            )

            FirebaseClient.isEmulatorStarted = true
        }
    }
}
