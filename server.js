const app = require('./app')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config({
    path: `${__dirname}/config.env`
})

const PORT = process.env.PORT || 3000
const DB = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD)

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Konekcija ka bazi podataka uspješna...'))
    .catch(err => console.log(err))

app.listen(PORT, () => {
    console.log(`Server pokrenut na portu ${PORT}`)
})