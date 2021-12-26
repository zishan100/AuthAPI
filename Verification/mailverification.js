const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "14c4db3790edf1",
    pass: "ad828183f32473"
  }
});


// Email Verifcation Method
exports.MailVerify =(res,otp,mail) => {
    console.log(otp, "  ", mail);
    
  let message = {
        from:"noreply@mail.com",
        to:mail,
        subject:"Email Verification",
        text: `Hello, 
                   Please verify your account by entering the following ${otp}`,
    };

   transport.sendMail(message, (err,result) => {
    if (err) {
        return res.status(400).json({
          msg:'something Error in Mail Server !!!'    
      })
     }
          
       console.log("send Mail-->",result);
       res.status(201).json({
          msg:'OTP had sent to your Register Email'    
      })   
})


}

// Reset Password Method 
exports.ResetPassword =(res,otp,mail) => {
    console.log(otp, "  ", mail);
    
  let message = {
        from:"noreply@mail.com",
        to:mail,
        subject:"RESET PASSWORD",
        text: `Hello,Please verify your account by entering the following ${otp}`,
    };

   transport.sendMail(message, (err,result) => {
    if (err) {
        return res.status(400).json({
          msg:'something Error in Mail Server !!!'    
      })
     }
          
       console.log("send Mail-->",result);
       res.status(201).json({
          msg:'OTP had sent to your  Email'    
      })   
})


}










 

