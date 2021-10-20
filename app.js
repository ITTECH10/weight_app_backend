const express = require('express')
const userRouter = require('./routers/UserRouter')
const cors = require('cors')
const globalErrorController = require('./controllers/errorController')
const AppError = require('./utils/appError')

const app = express()

app.use(express.json())
app.use(cors())

app.use('/api/v1/users', userRouter)

app.all('*', (req, res, next) => {
    next(new AppError(`The requested url ${req.originalUrl} could not be found.`, 404))
})

// ERROR HANDLING
app.use(globalErrorController)

module.exports = app