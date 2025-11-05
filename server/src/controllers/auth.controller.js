import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "../config/constants.js"
import { createAccessToken, createRefreshToken, createSession, createUser, getUserByEmail, getUserByUserId, hashPassword, verifyPassword } from "../services/auth.services.js"

export const postRegisterPage = async (req, res) => {
    try {
        const { name, email, password } = req.body

        const existingUser = await getUserByEmail(email)

        if (existingUser) return res.status(409).json({ success: false, message: 'User already exists.' })

        const hashedPassword = await hashPassword(password)

        await createUser({ name, email, password: hashedPassword })

        return res.status(201).json({ success: true, message: 'User registered successfully.' })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: 'Internal server error.' })
    }
}

export const postLoginPage = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await getUserByEmail(email)

        if (!user) return res.status(404).json({ success: false, message: 'User doesn\'t exists.' })

        const isPasswordValid = await verifyPassword({ hashedPassword: user.password, password })

        if (!isPasswordValid) return res.status(401).json({ success: false, message: 'Invalid Password.' })

        const session = await createSession({ userId: user._id, userAgent: req.headers['user-agent'], ip: req.clientIp })

        const accessToken = await createAccessToken({ id: user._id, sessionId: session._id, name: user.name, email: user.email })

        const refreshToken = await createRefreshToken(session._id)

        const baseConfig = { httpOnly: true, secure: false, sameSite: 'lax' }
        res.cookie('access_token', accessToken, {
            ...baseConfig,
            maxAge: ACCESS_TOKEN_EXPIRY
        })

        res.cookie('refresh_token', refreshToken, {
            ...baseConfig,
            maxAge: REFRESH_TOKEN_EXPIRY
        })

        return res.status(201).json({ success: true, message: 'Logged in successfully.' })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: 'Internal server error.' })
    }
}

export const getMePage = async (req, res) => {
    try {
        const userInfo = req.user

        if (!userInfo)
            return res.status(404).json({ success: false, message: 'User not found' })

        return res.status(200).json({ success: true, userInfo })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

export const logoutUserPage = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ success: false, message: 'Unauthorized' });

        const baseConfig = { httpOnly: true, secure: false, sameSite: 'lax' }
        res.clearCookie('access_token', baseConfig);
        res.clearCookie('refresh_token', baseConfig);

        return res.status(200).json({ success: true, message: 'User logout successfully.' })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

