"use strict";

var express = require("express");
var mongo = require("mongodb");
var endpoint = require("./database");
var dns = require("dns");

var bodyParser = require("body-parser");

var cors = require("cors");

var app = express();

// Basic Configuration
var port = 3000;

/** this project needs a db !! **/

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});
app.get("/api/shorturl/:urlId/", (req, res) => {
  var urlId = req.params.urlId;

  endpoint.getUrl(urlId, (err, data) => {

    if (err) res.json({ error: "Cannot retrieve URL" });
    else{
      res.redirect(`http://${data.url}`)
    }
  });
});


app.use("/api/shorturl/new/", (req, res, next) => {
  var url = req.body.url;
  dns.lookup(url, (err, address, family) => {
    if (err) res.json({ error: "invalid URL" });
    else {console.log(`\nIP Address:  ${address}\n`);
    next();
  }
  });
});
app.post("/api/shorturl/new/", (req, res) => {
  var url = req.body.url;
  endpoint.addNewUrl(url, (err, data) => {
    if (err) console.log(err);
    else {
      res.json({ original_url: url, short_url: data["identifier"]});
      console.log(data);
    }
  });
});



app.listen(port, function () {
  console.log("Node.js listening ...");
});
