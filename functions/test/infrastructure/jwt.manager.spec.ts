import { JWTManager } from "infrastructure/jwt.manager"

describe('JWTManager', () => {

    const generateJWT = (): string => {
        return (new JWTManager).generateJWT({
            uid: '123abc',
            expiresIn: new Date
        })
    }

    it('generateJWT', async () => {
        const jwt = generateJWT()
        expect(typeof jwt === 'string').toBeTruthy()
        expect(jwt.split('.').length).toBe(3)
    })

    it('verifyJWT', async () => {
        const jwt = generateJWT()
        const result = await (new JWTManager).verifyJWT(jwt)
        expect(result.sub).toBe('123abc')
    })
})
