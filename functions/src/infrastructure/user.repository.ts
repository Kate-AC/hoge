import { User, UserVO } from 'domain/user/user'
import { ConvertibleRefOwner } from 'domain/owner/owner'
import { UserRepositoryInterface } from 'domain/user/user.repository.interface'
import { FirebaseClientInterface } from 'infrastructure/firebase/firebase.client'
import { FollowAction, LikeAction, ReTweetAction, ActionType, ActionInterface, ActionVO } from 'domain/user/action'
import { getDoc, doc, setDoc } from 'firebase/firestore'
import { TwitterAccountId } from 'domain/twitter/tweet'
import { Firestore } from 'firebase/firestore'

export class UserRepository implements UserRepositoryInterface {

    constructor(private readonly firebaseClient: FirebaseClientInterface) {}

    async save(user: User): Promise<boolean> {
        const ref = doc(this.firebaseClient.firestore, 'users', user.accountId)
        const userJson = JSON.parse(JSON.stringify(new UserVO(user)))

        return await setDoc(ref, userJson)
            .then(() => true)
            .catch(() => false)
    }

    async saveActions(user: User, targetAccountId: TwitterAccountId): Promise<boolean> {
        const ref = doc(this.firebaseClient.firestore, 'users', user.accountId, 'actions', targetAccountId)

        const actions = await Promise.all(user.actions[targetAccountId].map(async action => {
            return await this.convertSavableAction(this.firebaseClient.firestore, action)
        }))

        return await setDoc(ref, {actions: actions})
            .then(() => true)
            .catch(() => false)
    }

    async find(accountId: TwitterAccountId): Promise<User | null> {
        const ref = doc(this.firebaseClient.firestore, 'users', accountId)
        const docSnap = await getDoc(ref);

        if (!docSnap.exists()) return null
        const userJson = JSON.parse(JSON.stringify(docSnap.data()))
        userJson.accountId = accountId

        return new User(userJson)
    }

    async findActions(accountId: TwitterAccountId, targetAccountId: TwitterAccountId, type?: ActionType): Promise<ActionInterface[]> {
        const ref = doc(this.firebaseClient.firestore, 'users', accountId, 'actions', targetAccountId)
        const docSnap = await getDoc(ref);

        if (!docSnap.exists()) { return [] }

        let actions = docSnap.data().actions

        if (type != undefined) {
            actions = await Promise.all(actions.filter(action => action.type === type))
        }

        return await Promise.all(actions.map(async (action) => {
            action.targetUser = new ConvertibleRefOwner(action.targetUserRef.id)
            delete action.targetUserRef
            switch (action.type) {
                case 'follow':  return new FollowAction(action)
                case 'like':    return new LikeAction(action)
                case 'retweet': return new ReTweetAction(action)
            }
        }))
    }

    async convertSavableAction(firestore: Firestore, action: ActionInterface): Promise<object> {
        const actionJson = JSON.parse(JSON.stringify(new ActionVO(action)))
        actionJson.targetUserRef = doc(
            firestore,
            action.targetUser.getCollectionName(),
            action.targetUser.getDocumentId()
        )

        return actionJson
    }
}
