const jwt = require('jsonwebtoken')
const UserModel = require('../models/User')


const Auth = async(req,res, next) => {
    try{
        const {token} = req.cookies

        if (!token) {
            res.status(401).json({
                'status': 'failed',
                'message': 'Unauthorized User, no token found!'
            })
            return
        }

        const data = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = await UserModel.findById(data.userId)
        next()
    }catch(err){
        res.send(err)
    }
}

module.exports = Auth