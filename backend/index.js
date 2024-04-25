import express from 'express'
import connectDB from './db/connect.js'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'express-async-errors'
const app = express()

// router imports
import authRoute from './routes/auth-route.js'
import userRoute from './routes/user-route.js'

// middleware imports
import notFoundMiddleware from './middlewares/not-found.js'
import errorHandlerMiddleware from './middlewares/error-handler.js'

dotenv.config()
app.use(cors())
app.use(express.json())
app.use(cookieParser())

// Using Routers
app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)



// Using middlewares
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const port = 3000
const start = async() =>  {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listening on port ${port}..`))
    } catch (error) {
        console.log(error)
    }
} 
start()