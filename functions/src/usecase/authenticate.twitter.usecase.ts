import { AccessTokenRepository, AccessTokenRepositoryInterface } from "infrastructure/access.token.repository";
import { TemporaryTokenRepository, TemporaryTokenRepositoryInterface } from "infrastructure/temporary.token.repository";
import { TwitterApiClient, TwitterApiClientInterface } from 'infrastructure/twitter/twitter.api.client'
import { JWTManager, JWTManagerInterface } from "infrastructure/jwt.manager"

export type AuthenticateTwitterInput = {
    oauthToken: string
    oauthVerifier: string
}

export interface AuthenticateTwitterUsecaseInterface {
    authenticateTwitter(input: AuthenticateTwitterInput): Promise<string>
}

export class AuthenticateTwitterUsecase implements AuthenticateTwitterUsecaseInterface {

    constructor(
        private temporaryTokenRepository: TemporaryTokenRepositoryInterface = new TemporaryTokenRepository(),
        private accessTokenRepository: AccessTokenRepositoryInterface = new AccessTokenRepository(),
        private jwtManager: JWTManagerInterface = new JWTManager(),
        private twitterApiClient: TwitterApiClientInterface = new TwitterApiClient()
    ) {}

    async authenticateTwitter(input: AuthenticateTwitterInput): Promise<string> {
        const token = await this.temporaryTokenRepository.find(input.oauthToken)
        const client = this.twitterApiClient.createAuthClient(input.oauthToken, token.oauthTokenSecret)
        const accessToken = await client.loginWithGenerateAccessToken(input.oauthVerifier)

        await this.accessTokenRepository.save(accessToken)
      
        return this.jwtManager.generateJWT({
          uid: accessToken.uid,
          expiresIn: accessToken.expiresIn
        })
    }
}
