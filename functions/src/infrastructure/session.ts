import { TwitterAccountId } from 'domain/twitter/tweet' 

export type TwitterAuthParams = {
  oauthToken: string
  oauthTokenSecret: string
}

export type TwitterOAuthParams = {
  state: string
  codeVerifier: string
  redirectUri: string
}

export type TwitterUserParams = {
  accountId: TwitterAccountId
  name: string
  twitterId: string
}

export type TwitterUserDelegationParams = {
  accessToken: string
  refreshToken: string
}

export interface SessionParams {
  auth: TwitterAuthParams
  oauth: TwitterOAuthParams
  user: TwitterUserParams
  userDelegation: TwitterUserDelegationParams
}

export const sessionConfig = {
  proxy: true,
  secret: 'fugafuga',
  resave: true,
  saveUninitialized: true,
  cookie: {
    path: '/',
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 30
  }
}
