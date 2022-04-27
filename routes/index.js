const express = require('express');
const router = express.Router();

const indexRouter = require('./indexRouter');

router.use('/api', indexRouter); // 注入用户路由模块

/* GET home page. */
router.all('/', function(req, resp) {
  resp.render('index', { title: 'Sakura' });
});

router.all('/test', function (req, resp) {
  resp.json({'sakura':'sakura'});
});

router.all('/favicon.ico', function (req, resp) {
  resp.end();
});

module.exports = router;
