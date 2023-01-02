import { TwitterAccountId } from 'domain/twitter/tweet'
import { User } from 'domain/user/user'
import { ActionInterface, ActionType } from './action'

export interface UserRepositoryInterface {

    save(user: User): Promise<boolean>
    saveActions(user: User, accountId: TwitterAccountId): Promise<boolean>
    find(accountId: TwitterAccountId): Promise<User | null>
    findActions(accountId: TwitterAccountId, targetAccountId: TwitterAccountId, type?: ActionType): Promise<ActionInterface[]>
}