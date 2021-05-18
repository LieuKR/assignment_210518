var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 로그인 여부를 판별하기위해 만든 미들웨어
const jwt = require('jsonwebtoken');
const jwtconfig  = require('./config/jwt_secret.json');

app.use(function(req, res, next){
  //JMT 쿠키가 클라이언트에게 존재할 경우
  try{
    if(req.cookies.JWT){
      let decoded_data = jwt.verify(req.cookies.JWT, `${jwtconfig.secret}`); // JMT decode를 시도
      if(decoded_data){
        res.locals.loginid = decoded_data.id; // res.locals.loginid에 로그인된 아이디를 변수로 할당
        next();
      } else { // 승인되지 않은 JMT일 경우 쿠키를 삭제하고 메인페이지로 리다이렉트
        res.clearCookie('JWT').send(req.cookies.JWT);
        res.redirect('/')
      }
    }
    else { // JMT가 존재하지 않을 경우 통과
      next();
    }
  } catch (err) { // JMT를 decode하는 과정에서 에러가 발생할 경우. 쿠키를 삭제하고 메인페이지로 리다이렉트
    res.clearCookie('JWT').send(req.cookies.JWT);
    res.redirect('/')
  }
});

app.use('/', indexRouter);
app.use('/login', loginRouter);

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

module.exports = app;
