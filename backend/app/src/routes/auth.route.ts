import express, { Router } from "express"
import { registerUser, loginUser, getMe, logoutUser, googleAuth } from "../controllers/auth.controller"
import { jwtVerifyMiddleware } from "../middlewares/auth.middleware"

const router: Router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get("/me", jwtVerifyMiddleware, getMe)
router.post("/logout", logoutUser)
router.post("/google", googleAuth)


export default router