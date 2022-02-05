require('dotenv').config();
   
console.log(process.env.NODE_ENV, " ", process.env.MONGODB_ATLAS);
module.exports = {
    NODE_ENV:process.env.NODE_ENV || 'production',
    PORT:process.env.PORT || 8033,
    MONGO_DB: process.env.MONGODB_ATLAS || "mongodb://3.110.27.99:27017/AuthDB",
    ACCESS_TOKEN_KEY:process.env.ACCESS_TOKEN_KEY || 'f8d2c69034c0031bd513e99b4010351e2b94fa4626c89a56f58146ceb3cb61024adb01247e2f28a4fcbe0c9541a1017f474e6bed25e126eb167f7e75c76ecd52'
}

