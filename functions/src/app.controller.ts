import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express'
import { AppService } from 'app.service';

import { signInWithRedirect } from 'firebase/auth';
import { TwitterAuthProvider } from 'firebase/auth';
import { FirebaseClient } from 'infrastructure/firebase/firebase.client';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) {}

  @Get()
  async getHello(@Req() request: Request): Promise<string> {
    const provider = new TwitterAuthProvider()
    const client = await new FirebaseClient
    await signInWithRedirect(client.auth, provider)

    return this.appService.getHello();
  }
}
