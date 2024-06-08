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
import categoryRoute from './routes/category-route.js'
import productRoute from './routes/product-route.js'
import cartRoute from './routes/cart-route.js'
import orderRoute from './routes/order-route.js'

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
app.use('/api/category', categoryRoute)
app.use('/api/product', productRoute)
app.use('/api/cart', cartRoute)
app.use('/api/order', orderRoute)


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