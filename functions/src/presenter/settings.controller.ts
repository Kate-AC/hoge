import { Controller, Get, Req } from '@nestjs/common'
import { Request } from 'express'
import { request } from 'http'

@Controller('settings')
export class SettingsController {
  @Get('eeeee')
  show(): {message: string} {
    return {
        message: "aaaaa"
    }
  }
}
