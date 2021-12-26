const JOI = require('joi');
const { body } = require('express-validator');
const UserProfile = require('../Model/user');
exports.RegisterValidation = () => {``
    
    return [
    body('username').isLength({ min: 3 }).withMessage('required username field'),
    body('password').isLength({ min: 6 }),
    body('email').isEmail().custom((value) => {
          
        return UserProfile.findOne({email:{$eq:value}}).then(user => {
            if (user) 
              return Promise.reject('This email Already register with Admin Account please Choose some other one');
               
           })  
    })
]
}



exports.LoginValidation = (data) => {
      
    const Schema =JOI.object({
        username: JOI.string().min(3),
        email: JOI.string().min(4).email(),
        password:JOI.string().min(6).required()
    })
         
    return Schema.validate(data);
}

exports.OTPValidation = (data) => {
     
    const Schema = JOI.object({
        otp: JOI.string().length(4).required()
    })  
    return Schema.validate(data);
}

exports.EmailValidation = (data) => {
       
    const Schema = JOI.object({
        email: JOI.string().min(4).email().required()
    })  
    return Schema.validate(data);

}

exports.PassValidation= (data) => {
       
    const Schema = JOI.object({
        password: JOI.string().min(6).required(),
        conformpassword:JOI.string().min(6).required()
    })
    
    return Schema.validate(data);

};

