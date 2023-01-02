import { UserRepository } from './user.repository'
import { Owner, OwnerVO } from 'domain/owner/owner'
import { OwnerRepositoryInterface } from 'domain/owner/owner.repository.interface'
import { FirebaseClient } from 'infrastructure/firebase/firebase.client'
import { setDoc, getDoc, doc } from 'firebase/firestore'
import { TwitterAccountId } from 'domain/twitter/tweet'

export class OwnerRepository implements OwnerRepositoryInterface {

    constructor(
        private readonly firebaseClient: FirebaseClient,
        private readonly userRepository: UserRepository
    ) {}

    async save(owner: Owner): Promise<boolean> {
        const ref = doc(this.firebaseClient.firestore, 'owners', owner.accountId)
        const ownerJson = JSON.parse(JSON.stringify(new OwnerVO(owner)))

        return await setDoc(ref, ownerJson)
            .then(() => true)
            .catch(() => false)
    }

    async find(accountId: TwitterAccountId): Promise<Owner | null> {
        const ref = doc(this.firebaseClient.firestore, 'owners', accountId)
        const docSnap = await getDoc(ref)
        const user = this.userRepository.find(accountId)

        if (!docSnap.exists() || user === null) return null

        const ownerJson = JSON.parse(JSON.stringify(docSnap.data()))
        ownerJson.accountId = accountId
        ownerJson.user = user

        return new Owner(ownerJson)
    }
}
