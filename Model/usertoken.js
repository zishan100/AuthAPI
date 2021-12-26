const Mongoose = require('mongoose');

const UserToken = new Mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
      type: String,
      required: true,
      unique:true 
    },
    expire_at: {
      type:Date,
      default:new Date(Date.now()+900*1000)   
    } 
},{timestamps:true})

UserToken.index({ "expire_at": 1 }, { "expireAfterSeconds": 0 });

module.exports = Mongoose.model('usertoken', UserToken);
