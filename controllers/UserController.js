const bcrypt = require('bcrypt');
const UserModel = require('../models/User');
const TokenModel = require('../models/Token');
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken')

class UserController{

    static userRegister = async(req,res) => {
        try{
            // console.log(req.body);
            const { name, userName, phone, email, password, dob, city, state, country, postalCode } = req.body

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt)

            const data = new UserModel({
                name: name,
                userName: userName,
                phone: phone,
                email: email,
                password: hashPassword,
                dob: dob,
                city: city,
                state: state,
                country: country,
                postalCode: postalCode,
            })

            const dataSaved = await data.save()

            if (dataSaved) {
                res.status(201).json({ 'status': 'success', 'message': 'Registration Successful!' })
            } else {
                res.status(401).json({ 'status': 'failed', 'message': 'Error, Try Again!' })
            }
        }catch(err){
            res.status(401).json({ 'status': 'failed', 'message': err })
        }
    }

    static userLogin = async(req,res) => {
        try{
            // console.log(req.body);
            const { email, password } = req.body

            if (email && password) {
                const user = await UserModel.findOne({ email: email })

                if (user != null) {
                    const isPasswordMatched = await bcrypt.compare(password, user.password)

                    if ((user.email === email) && isPasswordMatched) {
                        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY)
                        // console.log(token);
                        res.cookie('token', token)

                        res.status(201).json({ 'status': 'success', 'message': 'Login Successfully with Web Token!', token, user })
                    } else {
                        res.status(401).json({ 'status': 'failed', 'message': 'User not Found!' })
                    }
                } else {
                    res.status(401).json({ 'status': 'failed', 'message': 'Email not Found!' })
                }
            } else {
                res.status(401).json({ 'status': 'failed', 'message': 'All Fields are required!' })
            }
        }catch(err){
            res.status(401).json({ 'status': 'failed', 'message': err })
        }
    }

    static logout = async(req,res) => {
        try{
            res.cookie("token", null, {
                expires: new Date(Date.now())
            })

            res.status(201).json({ success: true, message: 'Logged Out' })
        }catch(err){
            res.status(401).json({ 'status': 'failed', 'message': err })
        }
    }

    static sendOtp = async(req,res) => {
        try{
            const { email } = req.body

            const isUserExist = await UserModel.findOne({ email: email })
    
            if (isUserExist) {
                const token = Math.floor(100000 + Math.random() * 900000)

                const tokenCount = await TokenModel.findOne().count()

                if (tokenCount > 0) {
                    const deleteAllToken = await TokenModel.deleteMany({email: email})
                }

                const tokendata = new TokenModel({
                    email: email,
                    token: token,
                })
                const tokenSaved = await tokendata.save()

                if (tokenSaved) {
                    const transporter = nodemailer.createTransport({
                        service: "gmail",
                        host: "smtp.gmail.com",
                        port: 465,               // true for 465, false for other ports
                        auth: {
                            user: 'youremail@gmail.com',
                            pass: 'password',
                        },
                    });

                    const mailData = await transporter.sendMail({
                        from: 'youremail@gmail.com',  // sender address
                        to: email,   // list of receivers
                        subject: 'OTP Verifcation for Forget Password',
                        text: 'Forget Password',
                        html: `Your One time Password to reset your QuickSnap password is ${token} `,
                    });

                    if (mailData) {
                        res.status(201).json({ 'status': 'success', 'message': 'User Found, OTP Sent to Email successfully!' })
                    } else {
                        res.status(401).json({ 'status': 'failed', 'message': 'Unable to Send Email!' })
                    }
                } else {
                    res.status(401).json({ 'status': 'failed', 'message': 'User Found, OTP not Send!' })
                }
            } else {
                res.status(401).json({ 'status': 'failed', 'message': 'User not Found!' })
            }
        }catch(err){
            res.status(401).json({ 'status': 'failed', 'message': err })
        }
    }

    static verifyOtp = async(req,res) => {
        try{
            const { token } = req.body

            const tokenCount = await TokenModel.findOne().count()

            if (tokenCount > 0) {
                const tokenData = await TokenModel.findOne({ token: token })
                
                if (tokenData) {
                    res.status(201).json({ 'status': 'success', 'message': 'OTP Verified Please Reset Password!', 'email': tokenData.email })
                } else {
                    res.status(401).json({ 'status': 'failed', 'message': 'Wrong OTP!' })
                }
            } else {
                res.status(401).json({ 'status': 'failed', 'message': 'No Token Found!' })
            }
        }catch(err){
            res.status(401).json({ 'status': 'failed', 'message': err }) 
        }
    }

    static resetPassword = async(req,res) => {
        try{
            const { email, password, confirmPassword } = req.body

            if (password === confirmPassword) {
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(password, salt)
    
                const userID = await UserModel.findOne({ email: email })
                const data = await UserModel.findByIdAndUpdate(userID._id,{
                    password: hashPassword,
                })

                const passwordChanged = await data.save()

                if (passwordChanged) {
                    const deleteAllToken = await TokenModel.deleteMany({email: email})
                    res.status(201).json({ 'status': 'success', 'message': 'Password Changed Successfully!' })
                } else {
                    res.status(401).json({ 'status': 'failed', 'message': 'Error Please Try Again' }) 
                }
            } else {
                res.status(401).json({ 'status': 'failed', 'message': 'Password Not Matching' }) 
            }
        }catch(err){
            res.status(401).json({ 'status': 'failed', 'message': err }) 
        }
    }

}
module.exports = UserController