const express = require('express')
const userRouter = require('./routers/UserRouter')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

app.use('/api/v1/users', userRouter)

module.exports = app