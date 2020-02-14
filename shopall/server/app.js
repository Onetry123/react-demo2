var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs')
var indexRouter = require('./routes/index');
var mongoose = require("mongoose");
var usersRouter = require('./routes/users');
var goodsRouter = require("./routes/goods");


mongoose.connect("mongodb://127.0.0.1:27017/demo", { useNewUrlParser: true },(err,data)=>{})
mongoose.connection.on("connected", () => {
  console.log("mongodb connected success")
})
mongoose.connection.on("error", () => {
  console.log("mongodb connected fail")
})
mongoose.connection.on("disconnected", () => {
  console.log("mongodb connected disconnected")
})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express)
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods', goodsRouter);

app.use((req, res, next) => {
  console.log(req.cookies)
  if (req.cookies.userId) {
    next()
  } else {
    if (req.originalUrl == '/users/login' || req.originalUrl == '/users/logOut' || req.originalUrl == '/users/checkLogin'|| req.path == '/goods/list') {
        next()
    } else {
      res.json({
        status: '10001',
        msg: '当前未登录',
        result:''
      })
    }
  }
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
