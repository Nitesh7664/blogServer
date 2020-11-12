const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true
   },
   imageFile: {
      type: String,
      required: true
   },
   tags: [String],
   description: {
      type: String,
      required: true
   },
   createdAt: {
      type: Date,
      default: new Date()
   }
})

module.exports = mongoose.model('Blog', blogSchema)