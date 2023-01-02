import * as functions from 'firebase-functions'
import { TemporaryTokenRepositoryInterface } from "infrastructure/temporary.token.repository"
import { AuthenticateTwitterInput, AuthenticateTwitterUsecase, AuthenticateTwitterUsecaseInterface } from "usecase/authenticate.twitter.usecase"
import { TwitterAuthParams } from 'infrastructure/session'
import { AccessTokenRepositoryInterface, AccessTokenVO } from "infrastructure/access.token.repository"
import { TwitterApiClientInterface, TwitterAuthLink } from "infrastructure/twitter/twitter.api.client"
import { DateGenerator } from "util/date.generator"
import { TwitterAccountId } from "domain/twitter/tweet"
import { TweetV2, UserV2 } from "twitter-api-v2"
import { JWTManager } from "infrastructure/jwt.manager"
import { AuthPresenter, AuthRequest, AuthResponse } from "presenter/auth.presenter"

describe('AuthPresenter', () => {

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

    class AuthTwitterUsecaseImpl implements AuthenticateTwitterUsecaseInterface {
        async authenticateTwitter(input: AuthenticateTwitterInput): Promise<string> {
            return 'jwtValue'
        }
    }

    class FailedAuthTwitterUsecaseImpl implements AuthenticateTwitterUsecaseInterface {
        async authenticateTwitter(input: AuthenticateTwitterInput): Promise<string> {
            throw new Error('error')
        }
    }

    class AuthRequestImpl implements AuthRequest {
        query = {
            oauth_token: 'oauthTokenValue',
            oauth_verifier: 'oauthVerifierValue'
        }
    }

    class AuthResponseImpl implements AuthResponse {
        redirectCalled = false
        cookieCalled = false

        redirect(url: string) {
            this.redirectCalled = true
            return
        }

        cookie(name: string, val: string, options: object): this {
            this.cookieCalled = true
            return this
        }
    }

    it('constructor', async () => {
        const authPresenter = new AuthPresenter
        expect(authPresenter instanceof AuthPresenter).toBeTruthy()
    })

    it('redirect', async () => {
        const authPresenter = new AuthPresenter(
            new AuthTwitterUsecaseImpl(),
            new TwitterApiClientImpl(),
            new TemporaryTokenRepo
        )
        const authResponseImpl = new AuthResponseImpl()
        await authPresenter.redirect(new AuthRequestImpl(), authResponseImpl)

        expect(authResponseImpl.redirectCalled).toBeTruthy()
    })


    it('callback when success', async () => {
        const authPresenter = new AuthPresenter(
            new AuthTwitterUsecaseImpl(),
            new TwitterApiClientImpl(),
            new TemporaryTokenRepo
        )
        const authResponseImpl = new AuthResponseImpl()
        await authPresenter.callback(new AuthRequestImpl(), authResponseImpl)

        expect(authResponseImpl.redirectCalled).toBeTruthy()
        expect(authResponseImpl.cookieCalled).toBeTruthy()
    })

    it('callback when failed', async () => {
        const authPresenter = new AuthPresenter(
            new FailedAuthTwitterUsecaseImpl(),
            new TwitterApiClientImpl(),
            new TemporaryTokenRepo
        )
        const authResponseImpl = new AuthResponseImpl()
        await authPresenter.callback(new AuthRequestImpl(), authResponseImpl)

        expect(authResponseImpl.redirectCalled).toBeTruthy()
        expect(authResponseImpl.cookieCalled).toBeFalsy()
    })
})