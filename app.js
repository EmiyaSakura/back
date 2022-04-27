const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const path = require('path');
const cookieParser = require('cookie-parser');
const lessMiddleware = require('less-middleware');
const logger = require('morgan');
const createError = require("http-errors");
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));// 日志
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());// 使用cookie
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));// 访问静态资源目录

app.use(bodyParser.json()); // 解析json数据格式
app.use(bodyParser.urlencoded({extended: true})); // 解析form表单提交的数据application/x-www-form-urlencoded

app.use(cors()); // 注入cors模块解决跨域

app.use('/', routes); //使用路由

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.listen(3000, () => { // 监听3000端口
  console.log('服务已启动 http://localhost:3000');
})

module.exports = app;

