import { Owner } from 'domain/owner/owner'
import { TwitterAccountId } from 'domain/twitter/tweet'

export interface OwnerRepositoryInterface {

    save(owner: Owner): Promise<boolean>
    find(accountId: TwitterAccountId): Promise<Owner | null>
}