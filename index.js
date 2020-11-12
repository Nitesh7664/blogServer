const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const app = express()

dotenv.config()

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI

mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
   .then(_data => app.listen(PORT, () => console.log(`connected to port ${PORT}`)))
   .catch(err => console.log(err))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use('/', require('./routes/user'))
app.use('/blogs', require('./routes/blog'))


