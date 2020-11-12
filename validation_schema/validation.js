const joi = require('joi')

const registerSchema = joi.object({
   email: joi.string().email().min(5).max(50).required(),
   firstName: joi.string().min(3).max(30).required(),
   lastName: joi.string().min(3).max(30).required(),
   password: joi.string().min(6).max(30).required()
})

const loginSchema = joi.object({
   email: joi.string().email().min(5).max(50).required(),
   password: joi.string().min(6).max(30).required()
})

const blogSchema = joi.object({
   title: joi.string().min(3).max(100).required(),
   imageFile: joi.string().required(),
   description: joi.string().min(5).max(1000).required()
})

module.exports = {loginSchema, registerSchema, blogSchema}