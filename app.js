const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Config = require('./config');
const mongoose = require('mongoose');
const port =Config.PORT || 8033;
app.use(bodyParser.json());
const AuthRoute = require('./Route/authRoute');
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods","GET,POST, PUT ,DELETE ,PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,authorization");
  next();
});

 

 
       
    // console.log(`${Config.MONGO_DB}  ${Config.PORT} ${Config.ACCESS_TOKEN_KEY} `)

app.use('/api/user/', AuthRoute);
app.use('/api/admin/',require('./Route/prodRoute'));
mongoose.connect(Config.MONGO_DB,{ useNewUrlParser: true })
    .then(result => {
       
        console.log("Database Connect Successfully...");
        app.listen(port, (err) => {
            if (err) {
                console.log("something error in server", err);
                return;
            }
            console.log(`${Config.NODE_ENV} server running on port no ${Config.PORT}`);
        });
    })
    .catch(err => console.log(`Error in DB Connection ${err}`));
