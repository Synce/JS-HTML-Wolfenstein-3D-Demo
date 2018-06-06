var http = require("http");
var bodyParser = require('body-parser');

var path = require("path")
var express = require("express")
const PORT = process.env.PORT || 8080;

var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application
app.use(express.static(__dirname + '/public'))

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/index.html"))
})


app.get("/*", function (req, res) {
    res.status(404);
    res.send("brak strony")

})

app.listen(PORT, function () {
    console.log('Our app is running on http://localhost:' + PORT);
})

