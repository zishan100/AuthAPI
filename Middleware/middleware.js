const JWT = require('jsonwebtoken');
const UserProfile = require('../Model/user');

exports.Authen =async(req,res,next) => {
    const AuthToken = req.headers.token;      
    try {

        if (!AuthToken) {
         return res.status(400).json({
           msg:'No Token Found !!!' 
        }) 
                
        }
        let Authen = JWT.verify(AuthToken, process.env.ACCESS_TOKEN_KEY);
            console.log("Authen user-->", Authen);
           let UserExists = await UserProfile.findOne({ email:Authen.email});
             if (!UserExists)
               return res.status(400).json('no user exists')   
            req.user = Authen.email;
            next();
       } catch (err) {
        return res.status(400).json({
            msg:'This is not a Valid Token !!!' 
         })    
         
    }
      
}
