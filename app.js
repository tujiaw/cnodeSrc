var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var engine = require('ejs-mate');
var config = require('./config');
var session= require('express-session');
var RedisStore = require('connect-redis')(session);
var MarkdownIt = require('markdown-it');
var md = new MarkdownIt();

//var routes = require('./routes/index');
//var users = require('./routes/users');
var webRouter = require('./routes/web_router');

var app = express();

// view engine setup
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: '13432532543645dgdf',
  store: new RedisStore({
    port: 6379,
    host: '127.0.0.1'
  }),
  resave: true,
  saveUninitialized: true
}));
app.use(function(req, res, next) {
  app.locals.current_user = req.session.user;
  next();
});

app.locals.config = config;
app.locals.md = md;

//app.use('/', routes);
//app.use('/users', users);
app.use('/', webRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
