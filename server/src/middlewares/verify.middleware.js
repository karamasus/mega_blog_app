import { ACCESS_TOKEN_EXPIRY } from "../config/constants.js"
import { createAccessToken, getSessionBySessionId, getUserByUserId, verifyJWTToken } from "../services/auth.services.js"

const verifyAuthentication = async (req, res, next) => {
    try {
        let accessToken = req.cookies.access_token
        const refreshToken = req.cookies.refresh_token

        req.user = null

        if (!refreshToken) return next()

        if (accessToken) {
            try {
                const useInfo = await verifyJWTToken(accessToken)

                req.user = useInfo
                return next()
            } catch (err) {
                if (err.name !== 'TokenExpiredError') {
                    console.error(err.message)
                    return next()
                }
                console.log('Access token expired, will refresh')
            }
        }

        try {
            const { sessionId } = await verifyJWTToken(refreshToken)
            const session = await getSessionBySessionId(sessionId)

            if (!session)
                return next()

            const user = await getUserByUserId(session.userId)

            const newAccessToken = await createAccessToken({ id: user._id, name: user.name, email: user.email, sessionId: session._id })

            const baseConfig = { httpOnly: true, secure: false, sameSite: 'lax' }
            res.cookie('access_token', newAccessToken, {
                ...baseConfig,
                maxAge: ACCESS_TOKEN_EXPIRY
            })

            accessToken = newAccessToken

            const userInfo = await verifyJWTToken(accessToken)
            req.user = userInfo

        } catch (err) {
            console.error('Refresh token invalid or expired:', err.message)
        }

        return next()
    } catch (err) {
        console.log(err)
        res.clearCookie('access_token')
        res.clearCookie('refresh_token')
        return next()
    }
}

export default verifyAuthentication

