import { Router } from 'express'
import { getMePage, logoutUserPage, postLoginPage, postRegisterPage } from '../controllers/auth.controller.js'

const router = Router()

router.route('/login').post(postLoginPage)
router.route('/register').post(postRegisterPage)
router.route('/me').get(getMePage)
router.route('/logout').post(logoutUserPage)

export const authRoutes = router


