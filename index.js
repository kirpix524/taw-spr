"use strict"
var path = require('path');
var express = require('express');
var http = require('http');
let log = require('lib/log')(module);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/')));

app.get('/', function(req, res){
  res.sendfile('./index.html');
  
});

let server = app.server = http.createServer(app);

server.listen('3000', "0.0.0.0", function () {

    log.info("Express server listening on port " + '3000');

});


//"start": "tsc && concurrently \"tsc -w\" \"node index.js\" "