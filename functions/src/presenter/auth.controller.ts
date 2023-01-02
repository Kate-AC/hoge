import { Controller, Get, Req, Redirect, Logger } from '@nestjs/common'
import { Request } from 'express'
import { TwitterApiClient } from 'infrastructure/twitter/twitter.api.client'
import { SessionParams } from 'infrastructure/session'
import { TwitterAccountId } from 'domain/twitter/tweet'

import { signInWithRedirect, signInWithPopup, signInWithCredential } from 'firebase/auth';
import { TwitterAuthProvider } from 'firebase/auth';
import { FirebaseClient } from 'infrastructure/firebase/firebase.client';

import { IParsedOAuth2TokenResult } from 'twitter-api-v2'

@Controller('auth')
export class AuthController {

  @Get('redirect')
  @Redirect('/', 301)
  async redirect(@Req() request: Request): Promise<object> {
    const client = (new TwitterApiClient).createAuthClient()
    const result = await client.createAuthLink()

    request.session.auth = {
      oauthToken: result.oauthToken,
      oauthTokenSecret: result.oauthTokenSecret
    }

    return { url: result.url }
  }

  @Get('callback')
  //@Redirect('/', 301)
  async callback(@Req() request: Request) {
    const { oauth_token, oauth_verifier } = request.query
    const { oauthTokenSecret } = request.session.auth

    const client = (new TwitterApiClient).createAuthClient(oauth_token as string, oauthTokenSecret)
    const hoge = await client.loginWithGenerateAccessToken(oauth_verifier as string)

    const firebaseClient = new FirebaseClient()
    const credential = TwitterAuthProvider.credential(hoge.accessToken, hoge.accessSecret)

    signInWithCredential(firebaseClient.auth, credential)
      .then(result => {
        console.log('thenだよ')
        console.log(result)
      })
      .catch(error => {
        console.log('errorだよ')
        console.log(error)
      })
  }
}
