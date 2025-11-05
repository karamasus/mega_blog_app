import Users from '../models/user.model.js'
import Sessions from '../models/session.model.js'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import conf from '../conf/conf.js'
import { ACCESS_TOKEN_EXPIRY, MILLISECOND_PER_SECOND, REFRESH_TOKEN_EXPIRY, SECONDS_PER_MINUTE } from '../config/constants.js'

export const getUserByEmail = async (email) => {
    try {
        return await Users.findOne({ email })
    } catch (err) {
        console.log(err)
        throw err
    }
}

export const hashPassword = async (password) => {
    try {
        return await argon2.hash(password)
    } catch (err) {
        console.log(err)
        throw err
    }
}

export const getSessionBySessionId = async (_id) => {
    try {
        return await Sessions.findOne({ _id })
    } catch (err) {
        console.log(err)
        throw err
    }
}

export const getUserByUserId = async (_id) => {
    try {
        return await Users.findOne({ _id })
    } catch (err) {
        console.log(err)
        throw err
    }
}

export const verifyPassword = async ({ hashedPassword, password }) => {
    try {
        return await argon2.verify(hashedPassword, password)
    } catch (err) {
        console.log(err)
        throw err
    }
}

export const createUser = async ({ name, email, password }) => {
    try {
        const newUser = new Users({ name, email, password })
        await newUser.save()
        return newUser
    } catch (err) {
        console.log(err)
        throw err
    }
}

export const createAccessToken = async ({ id, name, email, sessionId }) => {
    try {
        return jwt.sign({
            id,
            sessionId,
            name,
            email
        }, conf.jwtSecret, {
            expiresIn: ACCESS_TOKEN_EXPIRY / MILLISECOND_PER_SECOND
        })
    } catch (err) {
        console.log(err)
        throw err
    }
}

export const createRefreshToken = async (sessionId) => {
    try {
        return jwt.sign({
            sessionId,
        }, conf.jwtSecret, {
            expiresIn: REFRESH_TOKEN_EXPIRY / MILLISECOND_PER_SECOND
        })
    } catch (err) {
        console.log(err)
        throw err
    }
}

export const createSession = async ({ userId, userAgent, ip }) => {
    try {
        const session = new Sessions({ userId, userAgent, ip })
        session.save()
        return session
    } catch (err) {
        console.log(err)
        throw err
    }
}

export const verifyJWTToken = async (token) => {
    try {
        return jwt.verify(token, conf.jwtSecret)
    } catch (err) {
        console.log(err)
        throw err
    }
}

