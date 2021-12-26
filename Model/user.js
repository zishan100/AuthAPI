const Mongoose = require('mongoose');

const UserSchema = new Mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
       type: String,
       required: true, 
    },
    verified: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type:String,
        default:'user'
    },
    Prod: [{
         type: Mongoose.Schema.Types.ObjectId,
         ref:'product'  
    }],
    Cart: [{
        type: Mongoose.Schema.Types.ObjectId,
        ref:'cart' 
    }]
},{timestamps:true})

module.exports = Mongoose.model('userprofile', UserSchema);
