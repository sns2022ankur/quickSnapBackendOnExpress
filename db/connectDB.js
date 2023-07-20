const mongoose = require('mongoose')


const connectDB = () => {
    return mongoose.connect(process.env.DB_LOCAL)
    .then((data)=>{
        console.log(`MongoDB connected with server: ${data.connection.host}`);
    }).catch((err)=>{
        console.log(err);
    })
}

module.exports = connectDB