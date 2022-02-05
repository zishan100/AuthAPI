const UserProfile = require('../Model/user');
const UserToken = require('../Model/usertoken');
const bcrypt = require('bcrypt');
const  {RegisterValidation,LoginValidation,OTPValidation, EmailValidation,PassValidation}= require('../Validation/uservalidation');
const jwt = require('jsonwebtoken');
const { MailVerify, ResetPassword } = require('../Verification/mailverification');
const {validationResult} = require('express-validator');
/*how to hashing any pain text using 'crypto' library */
// const Crypto = require('crypto')
// const hash=Crypto.createHmac('sha256', "ruewiorwuior").update('hi everyone guys').digest('hex');
// Post Request ==> /api/user/register/

exports.UserRegister = async (req, res, next) => {
      
  try {
     
     console.log(req.body);
     const Validate = validationResult(req);
     console.log(Validate);
    
    if(!Validate.isEmpty()) {
        console.log(Validate.array());
        return res.status(400).json({
           msg:Validate.array()[0].msg 
       })  
    }
    
     const hashpass = bcrypt.hashSync(req.body.password, 10);
      
    if (req.body.role === 'admin') {
         
      let adminuser =await UserProfile.findOne({ isAdmin: { $eq: 'admin' } });
      console.log(adminuser);
        if(adminuser)
           return res.status(400).send('please Choose user field to register user Account');
    }
    
     const userprofile = new UserProfile({
        username: req.body.username,
        email: req.body.email,
        password: hashpass,
        isAdmin:req.body.role==='admin' ? 'admin' :'user'  
     })              
    
    let user = await userprofile.save();
    console.log("user profile-->", user);
      // Here Generating 4 Digit OTP  
        let digit = '0123456789';
        let OTP='';
        for (let i = 1;i<=4;i++){
          OTP += digit[Math.floor(Math.random() * 10)];
        } 
        console.log(OTP);
        let token = new UserToken({
            email: user.email,
            otp: OTP
        });
         
       await token.save((err, Token) => {
            if (err) {
             
              return res.status(500).json({
                msg:"something error in server !!!" 
             })  
          }
          
         console.log("Token Created-->", Token);
         
         res.set('email', user.email);
         MailVerify(res,Token.otp,user.email);
            
        })         
 
       
   } catch (err) {
          if(err) {
            if (err.code === 11000) {
               return res.status(400).json({
                msg:"Your Email or Username is  Already Exits Please Login !!!"   
            })    
           }
           return res.status(500).json({
               msg:"something error in server !!!" 
           })  
      }
    }
    
   
}
// Post Request==> /api/user/login/
exports.UserLogin = (req,res,next) => {
      
    const Validate =LoginValidation(req.body);
    console.log(Validate.error);        
    if (Validate.error) {
        console.log(Validate.error.details[0]);
        return res.status(400).json({
           msg:Validate.error.details[0].message 
       })  
    } 
    
    UserProfile.findOne({$or:[{email:{$eq:req.body.email}},{username:{$eq:req.body.username}}]})
        .then(user => {
             if(!user)
                 return res.status(400).json({
                   msg:'no user exists' 
                })   
            
            bcrypt.compare(req.body.password, user.password, (err,isMatch) => {
                
                if (!isMatch) {
                    return res.status(400).json({
                      msg:"Please Enter Correct Password that Does not Match With Original one" 
                   })   
                     
                }
                 
              let encryptToken= jwt.sign({ email: req.body.email },process.env.ACCESS_TOKEN_KEY, { expiresIn: '24h', algorithm: 'HS256' });
                //  console.log(token) 
                console.log("Verified User-->",user.verified);
                if (user.verified) {
                   res.set('token',encryptToken); 
                    res.status(200).json({
                    msg:'user login successfully...' 
                   })    
                } else {
                  
                   // Here Generating 4 Digit OTP  
                    let digit = '0123456789';
                    let OTP='';
                    for (let i = 1;i<=4;i++){
                    OTP += digit[Math.floor(Math.random() * 10)];
                    } 
                    
                    let token = new UserToken({
                        email: user.email,
                        otp: OTP
                    });
                    
                    UserToken.deleteMany({ email:{$eq:req.body.email } }, (err, result) => {
                          if (err) {
                            
                              return res.status(500).json({
                                 msg:"something error in server !!!" 
                               })  
                           }  
                        console.log(result);
                      
                        token.save((err, Token) => {
                        
                            if (err) {
                            
                              return res.status(500).json({
                                 msg:"something error in server !!!" 
                               })  
                           }
                            console.log("Token Created-->", Token);

                            res.set('email', user.email);
                            
                            MailVerify(res, Token.otp, user.email);
                        
                        });
                     })
                    
                }
                
 
            })      
         
        }).catch(err => {
            if (!err.statusCode) {
               return res.status(500).json({
                 msg:"there is something undefined data type !!!"
               });
            }
            res.status(422).json({
               msg:'something error in server !!!'  
            })              
         })
     
}

/* Email Verification via sending OTP */
// POST Request--> /api/user/verifyemail/

exports.VerifyMail = async (req, res, next) => {
     
    
    
  try {
    let email = req.headers.email;
        
    console.log(req.body," ",email);
    const Validate = OTPValidation(req.body);
    console.log(Validate.error);
    if (Validate.error) {
      console.log(Validate.error.details[0]);
      return res.status(400).json({
        msg: Validate.error.details[0].message
      });
    }
     
    let usertoken = await UserToken.findOne({ email: email }).sort({ createdAt: -1 });
        
    if (!usertoken) {
              
      return res.status(400).json({
        msg: 'no token found !!!'
      });
    }
    console.log(usertoken.otp, " ", req.body.otp);
    if (usertoken.otp === req.body.otp) {
          
      let result = await UserToken.deleteMany({ email: email });
      console.log("result-->", result);
           
      let user = await UserProfile.findOne({ email: email });
      user.verified = true;
      await user.save();
         
      return res.status(201).json({
        msg: 'Email Verified Successfully...'
      });
    }
 
    res.status(400).json({
      msg: 'Please Enter Corrcet OTP to Verify your Email !!!'
    });
        
  } catch (err) {
    console.log(err);
    if (!err.statusCode) {
      return res.status(500).json({
        msg: "there is something undefined data type !!!"
      });
    }
    res.status(422).json({
      msg: 'something error in server !!!'
    });
         
  }
}
/* Sending OTP via Email for Forget Password  */
// Post Request==> /api/user/ValidateEmail/ 
// body--> email         
  exports.VerifyEmailOfForgetPassword = (req,res,next) => {
           
       let Validate = EmailValidation(req.body);
       
      
       if(Validate.error) {
         
         console.log(Validate.error.details[0]);
         return res.status(400).json({
           msg:Validate.error.details[0].message 
         })  
        } 
          
        UserProfile.findOne({email:req.body.email})                   
            .then(user => {
                   
                if (!user) {
                    return res.status(400).json({
                      msg:'no user found !!!' 
                   }) 
                }
                  // Here Generating OTP 
                    let digit = '0123456789';
                    
                    let OTP = '';
                    
                    for (let i = 1; i <= 4; i++){
                    OTP += digit[Math.floor(Math.random() * 10)];
                    } 
                    
                    let token = new UserToken({
                        email: user.email,
                        otp: OTP
                    });
                    
                    UserToken.deleteMany({ email:{$eq:req.body.email } }, (err, result) => {
                          if (err) {
                            
                              return res.status(500).json({
                                 msg:"something error in server !!!" 
                               })  
                           }  
                        console.log(result);
                      
                        token.save((err, Token) => {
                        
                            if (err) {
                            
                              return res.status(500).json({
                                 msg:"something error in server !!!" 
                               })  
                           }
                            console.log("Token Created-->", Token);

                            res.set('email', user.email);
                            
                            ResetPassword(res, Token.otp, user.email);
                        
                        });
                     })          
                 
                   
            }).catch(err => {
               
                console.log(err);
               
                if (!err.statusCode) {
                  return res.status(500).json({
                     msg:"there is something undefined data type !!!"
                  });
                }
               
                res.status(422).json({
                  msg:'something error in server !!!'  
                });

            })




   }
  
  /* Conforming of OTP for Forget Password   */
  // Post Request ==> /api/user/ConformOTP/
  // headers--> email  
  // body--> otp
  
 exports.ConformationOfOTP = async (req, res, next) => {
        
      
   try {
     console.log(req.headers.email, " ", req.body.otp);
        let Validate = OTPValidation(req.body);
        if (Validate.error) {
          console.log(Validate.error.details[0]);
         return res.status(400).json({
           msg:Validate.error.details[0].message 
         })  
        } 
          
        let usertoken=await UserToken.findOne({ email:req.headers.email}).sort({ createdAt: -1 });
 
          if(!usertoken) {
             
              return res.status(400).json({
                 msg:'no token found !!!' 
             })  
          }
          
          if (usertoken.otp === req.body.otp) {
             
              res.set('token',req.body.otp);
              res.status(200).json({
                msg:'Your Token Conformed Successfully...'  
             }) 
               
          } else {
                
              res.status(400).json({
                 msg:'Please Enter Correct Token to Verify your Email'   
              })  
          }  
             
          
       }catch (err) {
            console.log(err);
               
            if (!err.statusCode) {
              return res.status(500).json({
                  msg:"there is something undefined data type !!!"
              });
             }

            res.status(422).json({
              msg:'something error in server !!!'  
            });
       }
       
}
    
    
  /* Reset Forget Password via OTP Conformation  */
  // Post Request==> /api/user/ResetForgetPassword/
  // headers-->token          
  // body--> newpassword,conformpassword           
     exports.ResetForgetPassword =async (req, res, next) => {
           
       try {
         let token = req.headers.token;
         let { password, conformpassword } = req.body;
         console.log(password, " ", conformpassword, " ", token);
        let Validate =PassValidation(req.body);
       
          if (Validate.error) {
           console.log(Validate.error.details[0]);
            return res.status(400).json({
             msg:Validate.error.details[0].message 
            })  
         } 
                  
          if(password !== conformpassword) {
              
            return res.status(400).json({
               msg:'password should be match with conform one !!!' 
             })     
           }
             
         
       let usertoken = await UserToken.findOne({otp:token}).sort({ createdAt: -1 });
             
           if (!usertoken) {
             return res.status(400).json({
                msg:'no token exists !!!' 
               })       
           }
                
         await UserToken.deleteMany({ email: usertoken.email });
         let hashpass = bcrypt.hashSync(password, 10);
         
         let updateProfile = await UserProfile.updateOne({ email: { $eq: usertoken.email } }, { $set: { password: hashpass } });
          
         if (updateProfile.modifiedCount > 0) {
           
           console.log("Password Updated", updateProfile);
           
           return res.status(201).json({
               msg:'password updated Successfully...' 
             })
          }
           res.status(400).json({
              msg:'password not updated Successfully !!!'
           })
 
       } catch (err) {
          
           console.log(err);
               
            if (!err.statusCode) {
              return res.status(500).json({
                  msg:"there is something undefined data type !!!"
              });
             }

            res.status(422).json({
              msg:'something error in server !!!'  
            });
       }
  }            
        
/* User Profile API */
// Post Request ==> api/user/user-profile/            
 
exports.userprofile = (req, res) => {
   
  let email = req.user;
   
  UserProfile.findOne({ email: email }, (err,user) => {
    if (err) return res.status(400).json({
         msg:'Something Error in Server !!!'
       })
       if(!user) return res.status(400).json({msg:'no user found !!!'})     
      let {username,email,isAdmin,createdAt,updatedAt}=user    
    res.status(200).json({username,email,isAdmin,createdAt,updatedAt});
      
   })
    
}
   












