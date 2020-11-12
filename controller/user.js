const jwt = require('jsonwebtoken')
const joi = require('joi')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const User = require('../models/User')
const {loginSchema, registerSchema} = require('../validation_schema/validation')

const loginController = async (req, res, next) => {
   const userData = req.body
   try{
      const {error, value} = loginSchema.validate(userData)
      if(error) return res.status(400).json(error.details[0].message)
      
      const userExist = await User.findOne({email: value.email})
      if(!userExist) return res.status(422).json({message: "User Does not exist with that email"})

       const matched = await bcrypt.compare(value.password, userExist.password)
       if(!matched) return res.status(422).json({message: 'User credentials mismatch'})

       const clienData = {
         _id: userExist._id,
         email: userExist.email
      }

      const token = jwt.sign(clienData, process.env.TOKEN_SECRET)
      
      res.status(200).header('auth-token', token).json({message: "Logged In SuccessFully"})


   }catch(err){
      res.status(422).json(err.message)
   }
}

const registerController = async (req, res, next) => {
   const userData = req.body;
   try{
      const {error, value} = registerSchema.validate(userData)
      if(error) return res.status(400).json(error.details[0].message)
      
      const userExist = await User.findOne({email: value.email})
      if(userExist) return res.status(422).json({message: "User already exist with that email"})

      const {email, password, firstName, lastName} = value

      const hashedPassword = await bcrypt.hash(password, 10)

      const newUser = new User({
         email,
         password: hashedPassword,
         firstName,
         lastName
      })

      const savedUser = await newUser.save()

      const clienData = {
         _id: savedUser._id,
         email: savedUser.email
      }

      const token = jwt.sign(clienData, process.env.TOKEN_SECRET)
      
      res.header('auth-token', token)

      res.status(201).json({...clienData, message: 'Registered Successfully', token})
   
   }catch(err){
      res.status(422).json(err.message)
   }
}

module.exports = {loginController, registerController}