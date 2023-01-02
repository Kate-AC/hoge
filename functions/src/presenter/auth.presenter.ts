import {
    AuthenticateTwitterUsecase,
    AuthenticateTwitterUsecaseInterface
} from 'usecase/authenticate.twitter.usecase'
import {
    TemporaryTokenRepository,
    TemporaryTokenRepositoryInterface
} from 'infrastructure/temporary.token.repository'
import { StringGenerator } from 'util/string.generator'
import { DateGenerator } from 'util/date.generator'
import { TwitterApiClient, TwitterApiClientInterface } from 'infrastructure/twitter/twitter.api.client'

export interface AuthRequest {
    query: { oauth_token?: string, oauth_verifier?: string }
}

export interface AuthResponse {
    redirect(url: string): void
    cookie(name: string, val: string, options: object): this;
}

export class AuthPresenter {

    constructor(
        private authTwitterUsecase: AuthenticateTwitterUsecaseInterface = new AuthenticateTwitterUsecase(),
        private twitterApiClient: TwitterApiClientInterface = new TwitterApiClient(),
        private temporaryTokenRepo: TemporaryTokenRepositoryInterface = new TemporaryTokenRepository()
    ) {}

    async redirect(_: AuthRequest, res: AuthResponse) {
        const client = this.twitterApiClient.createAuthClient() 
        const result = await client.createAuthLink()

        await this.temporaryTokenRepo.save({
            oauthToken: result.oauthToken,
            oauthTokenSecret: result.oauthTokenSecret
        })

        res.redirect(result.url)
    }

    async callback(req: AuthRequest, res: AuthResponse) {
        const { oauth_token, oauth_verifier } = req.query
      
        await this.authTwitterUsecase.authenticateTwitter({
            oauthToken: oauth_token as string,
            oauthVerifier: oauth_verifier as string
        })
            .then((jwt: string) => {
                const cookieName = `_session_${StringGenerator.getRamdomCharacters()}`
                res.cookie(cookieName, jwt, {
                    maxAge: DateGenerator.getDate1DayLater().getTime(),
                    httpOnly: true,
                    secure: true,
                    domain: process.env.FRONT_DOMAIN
                })
                res.redirect(`${process.env.FRONT_URL}/home`)
            })
            .catch(_ => {
                res.redirect(process.env.FRONT_URL)
            }) 
    }
}
