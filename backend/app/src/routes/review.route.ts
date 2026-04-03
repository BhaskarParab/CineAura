import express, { Router } from "express"
import { jwtVerifyMiddleware } from "../middlewares/auth.middleware"
import { createReview, getReviews, updateReview, deleteReview } from "../controllers/review.controller"

const router: Router = express.Router()

router.post('/',jwtVerifyMiddleware, createReview)
router.get('/:tmdbId',jwtVerifyMiddleware, getReviews)
router.put("/:id", jwtVerifyMiddleware, updateReview)
router.delete("/:id", jwtVerifyMiddleware, deleteReview)

export default router