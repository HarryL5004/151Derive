var express = require('express');
var exphbs  = require('express-handlebars');
var path = require('path');

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

module.exports = app;
