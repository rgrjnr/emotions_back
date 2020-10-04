const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");


// DATABASE INIT
mongoose.connect("mongodb://localhost/emotions", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("debug", true);
let db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB"));
db.on("error", (err) => console.log(err));

// AWS INIT
var AWS = require("aws-sdk");

var config = new AWS.Config({
    region: 'us-east-2'
});

AWS.config = config
AWS.config.getCredentials(function(err) {
  if (err) console.log(err.stack);
  // credentials not loaded
  else {
    console.log("Access key:", AWS.config.credentials.accessKeyId);
  }
});

// APP INIT
const app = express();

app.use(
  bodyParser.urlencoded({
    extended: false,
    limit: 1024 * 1024 * 10,
  })
);
app.use(bodyParser.json());
app.use(cors());

let routes = require('./routes');
app.use('/', routes);

app.listen(3030, function () {
  console.log("Server started at http://localhost:3030");
});
