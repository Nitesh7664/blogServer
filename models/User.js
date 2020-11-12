const mongoose = require('mongoose')

const Blog = require('./Blog').schema

const userSchema = new mongoose.Schema({
   email: {
      type: String,
      required: true
   },
   firstName: {
      type: String,
      required: true
   },
   lastName: {
      type: String,
      required: true
   },
   password: {
      type: String,
      required: true
   },
   blogs: [Blog]
})

module.exports = mongoose.model('User', userSchema)