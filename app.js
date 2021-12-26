const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const port =process.env.PORT || 8033;
require('dotenv').config();
app.use(bodyParser.json());
const AuthRoute = require('./Route/authRoute');



app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods","GET,POST, PUT ,DELETE ,PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,authorization");
  next();
});

app.use('/api/user/', AuthRoute);
app.use('/api/admin/',require('./Route/prodRoute'));
mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true })
    .then(result => {
       
        console.log("Database Connect Successfully...");
        app.listen(port, (err) => {
            if (err) {
                console.log("something error in server", err);
                return;
            }
            console.log("Server is Running on Port", port);
        });
    })
    .catch(err => console.log(`Error in DB Connection ${err}`));
