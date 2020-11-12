const mongoose = require('mongoose')
const joi = require('joi')

const Blog = require('../models/Blog')
const User = require('../models/User')
const {blogSchema} = require('../validation_schema/validation')

const createBlog = async (req, res, next) => {

   try{
      const {title, imageFile, description, tags} = req.body

      const {error, value} = blogSchema.validate({title, imageFile, description})

      if(error) return res.status(422).json(error.details[0].message)
      
      const newBlog = new Blog({
         title,
         imageFile,
         description,
         tags: tags.split(',')
      })

      const savedBlog = await newBlog.save()

      const _user = await User.findOne({email: req.user.email})
      const blogs = _user.blogs
      blogs.push(savedBlog)

      await User.updateOne({_id: req.user._id}, {blogs, blogs})

      res.status(201).json(savedBlog)

   }catch(err){
      res.status(422).json(err.message)
   }

}

const getAllBlog = async (req, res, next) => {

   try{
      const allBlogs = await Blog.find({})
      res.status(200).json(allBlogs)
   }catch(err){
      res.status(422).json(err.message)
   }

}

const getAllBlogOfUser = async (req, res, next) => {

   try{
      const userData = await User.findOne({email: req.user.email})
      const blogs = userData.blogs
      res.status(200).json(blogs)
   }catch(err){
      res.status(422).json(err.message)
   }

}

const getOneBlog = async (req, res, next) => {
   const id = req.params.id
   try{
      if(id != new mongoose.Types.ObjectId(""+id)) return res.status(422).json({message: 'Invalid Id'})
      const blog = await Blog.findOne({_id: id})

      if(!blog) return res.status(404).json({message: 'Blog with this Id does not exist'})

      res.status(200).json(blog)
   }catch(err){
      res.status(422).json(err.message)
   }
}

const deleteBlog = async (req, res, next) => {
   const id = req.params.id
   try{
      if(id != new mongoose.Types.ObjectId(""+id)) return res.status(422).json({message: 'Invalid ID'})

      const blogExist = await Blog.findOne({_id: id})
      const userData = await User.findOne({_id: req.user._id})
      const blogs = userData.blogs

      if(!blogExist || !isBlogCreator(blogs, id)) return res.status(422).json({message: 'Cannot delete the blog'})

      await Blog.deleteOne({_id: id})
      updatedUserBlog = blogs.filter(_blog => _blog._id != id)

      await User.updateOne({_id: req.user._id}, {blogs: updatedUserBlog})

      const clientData = {
         _id: blogExist._id,
         title: blogExist.title,
         message: 'Deleted Successfully'
      }
      res.status(200).json(clientData)

   }catch(err){
      res.status(422).json(err.message)
   }

}


const isBlogCreator = (blogs, id) => {
   const index = blogs.findIndex(_blog => _blog._id == id)
   return index === -1? false: true
}

module.exports = {createBlog, getAllBlog, getAllBlogOfUser, getOneBlog, deleteBlog};