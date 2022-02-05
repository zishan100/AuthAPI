const dotenv = require('dotenv');
const path = require('path');

console.log(process.env.NODE_ENV);
dotenv.config({
    path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`)
});
 
module.exports = {
    NODE_ENV : process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
    MONGO_DB: process.env.MONGO_DB || "mongodb+srv://Authen:lthQV5268BXvub6M@cluster0.5tkyb.mongodb.net/Auth?retryWrites=true&w=majority",
    ACCESS_TOKEN_KEY:process.env.ACCESS_TOKEN_KEY
}