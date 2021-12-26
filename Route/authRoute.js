const route = require('express').Router();
const AuthController = require('../Controller/authcontroller');
const { RegisterValidation } = require('../Validation/uservalidation');
const {Authen} = require('../Middleware/middleware');
route.post('/register/', RegisterValidation() , AuthController.UserRegister);
route.post('/login/', AuthController.UserLogin);

route.post('/verifyemail/', AuthController.VerifyMail);
// forget password

route.post('/ValidateEmail/', AuthController.VerifyEmailOfForgetPassword);
route.post('/ConformOTP/', AuthController.ConformationOfOTP);

route.post('/ResetForgetPassword/', AuthController.ResetForgetPassword);
route.get('/user-profile/', Authen, AuthController.userprofile);

module.exports = route;