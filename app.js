var createError = require('http-errors');
var express = require('express');
var request = require('request');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var restApiUrl = process.env.API_URL;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.get('/', function(req, res) {
  request(
      restApiUrl, {
          method: "GET",
      },
      function(err, resp, body) {
          if (!err && resp.statusCode === 200) {
              var objData = JSON.parse(body);
              var c_cap = objData.data;
              var responseString = `<table border="1"><tr><td>Country</td><td>Capital</td></tr>`;

              for (var i = 0; i < c_cap.length; i++)
                  responseString = responseString +
                    `<tr><td>${c_cap[i].country}</td><td>${c_cap[i].capital}</td></tr>`;

              responseString = responseString + `</table>`;
              res.send(responseString);
          } else {
              console.log(err);
          }
      });
});

module.exports = app;
