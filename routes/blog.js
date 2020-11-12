const express = require('express')
const router = express.Router();

const {createBlog, getAllBlog, getAllBlogOfUser, getOneBlog, deleteBlog} = require('../controller/blog')
const {verifyToken} = require('../middleware/verifyToken')

router.get('/', verifyToken, getAllBlog)

router.get('/user', verifyToken, getAllBlogOfUser)

router.get('/:id', verifyToken, getOneBlog)

router.post('/add', verifyToken, createBlog)

router.delete('/delete/:id', verifyToken, deleteBlog)

module.exports = router