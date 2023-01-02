import { Controller, Get, Req, Param } from '@nestjs/common'
import { Request } from 'express'
import { TwitterApiClient } from 'infrastructure/twitter/twitter.api.client'
import { TwitterRepository } from 'infrastructure/twitter/twitter.repository'

@Controller('users')
export class UsersController {
  @Get(':twitterId')
  async show(@Req() request: Request, @Param('twitterId') twitterId: string) {
    const { user, userDelegation } = request.session

    /*
    // ログインもしくは何かのタイミングで1回だけ取る
    const client = new TwitterApiClient(userDelegation.accessToken)
    const repository = new TwitterRepository(client)

    const likes = await repository.fetchLikesByAccountId(user.accountId)
    const retweets = await repository.fetchRetweetsByAccountId(user.accountId)
    const followings = await repository.fetchFollowingsByAccountId(user.accountId)

    console.log(likes)
    console.log(retweets)
    console.log(followings)
*/
    // これをActionsに変換
    // 毎回API叩くのはアレなので、repositoryの
  }
}
