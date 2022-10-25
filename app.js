const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const Config = require("./config");
const mongoose = require("mongoose");
const port = Config.PORT || 8033;
const cluster = require("cluster");
const totalCPUs = require("os").cpus().length;

app.use(bodyParser.json());
const AuthRoute = require("./Route/authRoute");

if (cluster.isMaster) {
  console.log(`Number of CPUs is ${totalCPUs}`);
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork();
  });
} else {
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST, PUT ,DELETE ,PATCH"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,authorization");
    next();
  });

  app.get("/", (req, res) => {
    for (let i = 0; i < 1e8; i++) {}

    res.send(`response send sucessfully...`);
  });

  // console.log(`${Config.MONGO_DB}  ${Config.PORT} ${Config.ACCESS_TOKEN_KEY} `)

  app.use("/api/user/", AuthRoute);
  //  app.use('/api/admin/',require('./Route/prodRoute'));
  // app.listen(port, (err) => {
  //   if (err) {
  //     console.log("something error in server", err);
  //     return;
  //   }
  //   console.log(
  //     `${Config.NODE_ENV} server running on port no ${Config.PORT} ${process.pid}`
  //   );
  // });

  mongoose
    .connect(Config.MONGO_DB, { useNewUrlParser: true })
    .then((result) => {
      app.listen(port, (err) => {
        if (err) {
          console.log("something error in server", err);
          return;
        }
        console.log(
          `${Config.NODE_ENV} server running on port no ${Config.PORT} ${process.pid}`
        );
      });
    })
    .catch((err) => console.log(`Error in DB Connection ${err}`));
}

// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Methods","GET,POST, PUT ,DELETE ,PATCH");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type,authorization");
//     next();
//   });

// app.get('/', (req, res) => {

//     for (let i = 0;i<1e8;i++){

//     }

//     res.send(`response send sucessfully...`)
//   })

//  // console.log(`${Config.MONGO_DB}  ${Config.PORT} ${Config.ACCESS_TOKEN_KEY} `)

//  //  app.use('/api/user/', AuthRoute);
//  //  app.use('/api/admin/',require('./Route/prodRoute'));
//     app.listen(port, (err) => {
//             if (err) {
//                 console.log("something error in server", err);
//                 return;
//             }
//             console.log(`${Config.NODE_ENV} server running on port no ${Config.PORT} ${process.pid}`);
//    });
