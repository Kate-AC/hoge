import { User } from "domain/user/user"
import { Owner } from "domain/owner/owner"
import { OwnerRepository } from "infrastructure/owner.repository"
import { defaultWeightSettings } from "domain/owner/weight.settings"
import { FirebaseTestClient } from "./firebase.test.client"
import { UserRepository } from "infrastructure/user.repository"

describe('OwnerRepository', () => {

    let client: FirebaseTestClient
    let ownerRepository: OwnerRepository

    const generageOwner = (): Owner => {
        return new Owner({
            accountId: '222',
            user: new User({
                accountId: '222',
                twitterId: 'twitterId222',
                displayName: 'NomalUser',
                icon: 'hogehoge.jpg',
                contractPlan: 'free',
                createdAt: new Date
            }),
            weightSettings: defaultWeightSettings(),
            contents: [],
        })
    }

    beforeEach(async () => {
        client = await (new FirebaseTestClient).createClient()
        ownerRepository = new OwnerRepository(
            client,
            new UserRepository(client)
        )
        await (new FirebaseTestClient).clearFirestore()
    })

    it('add and find', async () => {
        const owner = generageOwner()

        expect(await ownerRepository.find(owner.accountId)).toBeNull()
        expect(await ownerRepository.save(owner)).toBeTruthy()
        expect(await ownerRepository.find(owner.accountId)).toBeTruthy()
    })
})
