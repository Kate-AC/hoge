import { TemporaryTokenRepositoryInterface } from "infrastructure/temporary.token.repository"
import { AuthenticateTwitterUsecase } from "usecase/authenticate.twitter.usecase"
import { TwitterAuthParams } from 'infrastructure/session'
import { AccessTokenRepositoryInterface, AccessTokenVO } from "infrastructure/access.token.repository"
import { TwitterApiClientInterface, TwitterAuthLink } from "infrastructure/twitter/twitter.api.client"
import { DateGenerator } from "util/date.generator"
import { TwitterAccountId } from "domain/twitter/tweet"
import { TweetV2, UserV2 } from "twitter-api-v2"
import { JWTManager } from "infrastructure/jwt.manager"

describe('AuthenticateTwitterUsecase', () => {

    class TemporaryTokenRepo implements TemporaryTokenRepositoryInterface {
        async save(params: TwitterAuthParams): Promise<void> {
            return
        }

        async find(oauthToken: string): Promise<TwitterAuthParams | null> {
            return {
                oauthToken: 'oauthTokenValue',
                oauthTokenSecret: 'oauthTokenSecretValue'
            }
        }
    }

    class AccessTokenRepo implements AccessTokenRepositoryInterface {
        async save(accessToken: AccessTokenVO): Promise<void> {
            return
        }

        async find(uid: string): Promise<AccessTokenVO | null> {
            return null
        }
    }

    class UserV2Impl implements UserV2 {
        id = 'aaa'
        name = 'iii'
        username = 'uuu'
    }

    class TwitterApiClientImpl implements TwitterApiClientInterface {
        createAuthClient(accessToken?: string, accessSecret?: string): TwitterApiClientInterface {
            return new TwitterApiClientImpl()
        }

        async createAuthLink(): Promise<TwitterAuthLink> {
            return {
                oauthToken: 'oauthTokenValue',
                oauthTokenSecret: 'oauthTokenSecretValue',
                oauthCallbackConfirmed: 'oauthCallbackConfirmedValue',
                url: 'urlValue'
            }
        }

        async loginWithGenerateAccessToken(oauthVerifier: string): Promise<AccessTokenVO> {
            return new AccessTokenVO({
                uid: 'uidValue',
                accountId: '111',
                accessToken: 'accessTokenValue',
                accessSecret: 'accessSecretValue',
                expiresIn: DateGenerator.getDate1DayLater()
            })
        }

        async findLikedTweetsByAccountId(accountId: TwitterAccountId): Promise<TweetV2[]> {
            return []
        }

        async findReTweetsByAccountId(accountId: TwitterAccountId): Promise<TweetV2[]> {
            return []
        }

        async findOneUserByTwitterId(twitterId: string): Promise<UserV2> {
            return new UserV2Impl()
        }

        async findFollowingsByAccountId(accountId: TwitterAccountId): Promise<UserV2[]> {
            return []
        }
    }

    beforeAll(async () => {

    })

    beforeEach(async () => {

    })

    it('authenticateTwitter', async () => {
        const usecase = new AuthenticateTwitterUsecase(
            new TemporaryTokenRepo(),
            new AccessTokenRepo(),
            new JWTManager(),
            new TwitterApiClientImpl()
        )

        const result = await usecase.authenticateTwitter({
            oauthToken: 'oauthTokenValue',
            oauthVerifier: 'oauthVerifierValue'
        })

        expect(typeof result === 'string').toBeTruthy()
        expect(result.split('.').length).toBe(3)
    })
})