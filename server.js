var http = require("http");
var bodyParser = require('body-parser');
var qs = require("querystring")
var path = require("path")
var express = require("express")
const PORT = 3000
var mongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID;
var Operations = require("./modules/Operations.js")
var _db;
var opers = new Operations();
var _coll;
var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application
app.use(express.static('public'))

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/index.html"))
})


app.get("/*", function (req, res) {
    res.status(404);
    res.send("brak strony")

})

app.listen(PORT, function () {
    console.log("start serwera na porcie ")
})

