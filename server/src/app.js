import express from 'express'
import cors from 'cors'
import { authRoutes } from './routes/auth.routes.js'
import verifyAuthentication from './middlewares/verify.middleware.js'
import cookieParser from 'cookie-parser'
import requestIp from 'request-ip'
import { postRoutes } from './routes/post.routes.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(cookieParser())
app.use(express.json())

app.use(requestIp.mw())

app.use(verifyAuthentication)

app.use((req, res, next) => {
    res.locals.user = req.user
    return next()
})

app.use('/api', authRoutes)
app.use('/api', postRoutes)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

export default app

