import { Controller, Get, Req, Redirect, Logger } from '@nestjs/common'
import { Request } from 'express'
import { TwitterApiClient } from 'infrastructure/twitter/twitter.api.client'
import { SessionParams } from 'infrastructure/session'
import { TwitterAccountId } from 'domain/twitter/tweet'

import { signInWithRedirect, signInWithPopup, signInWithCredential } from 'firebase/auth';
import { TwitterAuthProvider } from 'firebase/auth';
import { FirebaseClient } from 'infrastructure/firebase/firebase.client';

import { IParsedOAuth2TokenResult } from 'twitter-api-v2'

@Controller('oauth')
export class OauthController {

  /*
  @Get('redirect')
  @Redirect('/', 301)
  async redirect(@Req() request: Request): Promise<object> {
    const client = TwitterApiClient.createAuthClient()
    const result = await client.generateOAuthLink()

    return await client.prepareOAuthBeginning(result, request.session as SessionParams)
  }

  @Get('callback')
  //@Redirect('/', 301)
  async callback(@Req() request: Request): Promise<{ url: string }> {
    const { state, code } = request.query;
    const { oauth } = request.session

    if (state !== oauth.state) {
      return
    }

    const client = TwitterApiClient.createAuthClient()

    const { client: loggedClient, accessToken, refreshToken } = await client.loginWithOAuth2({
      code: code as string,
      codeVerifier: oauth.codeVerifier,
      redirectUri: oauth.redirectUri
    })

    const { data } = await loggedClient.v2.me()

    request.session.user = {
      accountId: data.id as TwitterAccountId,
      name: data.name,
      twitterId: data.username
    }

    request.session.userDelegation = {
      accessToken: accessToken,
      refreshToken: refreshToken
    }

    return { url: '/' }
  }
  */
}
