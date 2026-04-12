import express, { Application } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authrouter from "./routes/auth.route"
import reviewRouter from "./routes/review.route"

const app: Application = express()

app.use(express.json())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
app.use(cookieParser())

app.use('/api/auth', authrouter)
app.use('/api/reviews', reviewRouter)


export default app