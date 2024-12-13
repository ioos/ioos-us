var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var assetmanager = require('assetmanager');
var ua = require('universal-analytics');


require('dotenv').config();

const SITE_CONFIG = process.env.SITE_CONFIG;
if (!SITE_CONFIG) {
  console.error('Error: Missing required environment variable SITE_CONFIG.');
  process.exit(1); // Exit the application with a failure code
}

var routes = require(`./sites/${SITE_CONFIG}/routes.js`);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var assets = assetmanager.process({
  assets: require('./assets.json'),
  debug: (process.env.NODE_ENV !== 'production'),
  webroot: 'public'
});

app.locals.assets = assets;

// google analytics
app.use(ua.middleware('UA-78530076-1', {cookieName: '_ga'}));

app.use(function (req, res, next) {
  res.locals.siteConfig = SITE_CONFIG;
  if (req.visitor) {
    req.visitor.pageview(req.url).send();
  }
  next();
});

app.use('/', routes);

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
