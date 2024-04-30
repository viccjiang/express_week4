var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// 解決跨域問題
var cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const postRouter = require('./routes/posts');


var app = express();

// const mongoose = require('mongoose');

// mongoose.connect('mongodb://127.0.0.1:27017/postTest')
//     .then(res=> console.log("連線資料成功"))
//     .catch(err=> console.log("連線資料失敗"))

require('./connections')

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postRouter);

module.exports = app;
