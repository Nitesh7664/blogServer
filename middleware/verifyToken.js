const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {

   const token = req.headers['auth-token'];
   if(!token) return res.status(422).json({message: 'Invalid Token. LOGIN or REGISTER first'})

   try{

      const userData = jwt.verify(token, process.env.TOKEN_SECRET)
      req.user = userData
      next()

   }catch(err){
      res.status(422).json(err.message)
   }

}

module.exports = {verifyToken}