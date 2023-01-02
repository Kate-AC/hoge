import { TwitterAccountId } from 'domain/twitter/tweet'
import * as jwt from 'jsonwebtoken'

export type JWTRequired = {
    uid: string
    expiresIn: Date
}

export type JWTPayload = {
    exp: number     // 有効期限
    iat: number     // 発行時間
    aud: string     // projectid
    iss: string     // https://session.firebase.google.com/<projectId>
    sub: string     // 空でない文字列である必要があり、ユーザーまたはデバイスのuidである必要があります。
    auth_time: Date // ユーザーが認証した時刻
}

export interface JWTManagerInterface {
    generateJWT(params: JWTRequired): string
    verifyJWT(token: string): Promise<JWTPayload>
}

export class JWTManager implements JWTManagerInterface {

    static readonly SECRET = process.env.JWT_SECRET
    static readonly EXPIRES_IN_SECOND = 60 * 60 * 24 * 1000

    generateJWT(params: JWTRequired): string {
        const payload = {
            exp: params.expiresIn.getTime(),
            iat: Date.now(),
            aud: process.env.FIREBASE_PROJECT_ID,
            iss: `https://session.firebase.google.com/${process.env.FIREBASE_PROJECT_ID}`,
            sub: params.uid,
            auth_time: new Date
        }

        return jwt.sign(payload, JWTManager.SECRET, { algorithm: 'HS256' })
    }

    async verifyJWT(token: string): Promise<JWTPayload> {
        return new Promise<JWTPayload>((resolve, reject) => {
            jwt.verify(token, JWTManager.SECRET, (error, decoded: JWTPayload) => {
                if (error) {
                    reject(error)
                }
                resolve(decoded)
            })
        })
    }
}