'use strict';
const express = require('express');
const bodyParser = require('body-parser');
var app = express();
const port = 8080;
const cors = require('cors');

var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:haravan123@ds153380.mlab.com:53380/haravan');
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());
app.use(express.json());

var productRoute = require('./routes/productRoute');
productRoute(app);

app.get('/', (req, res) => res.send('<strong>Hello bây bê :><strong>'));

app.listen(port, function() {
    console.log('Port ' + port + ': Success!');
});