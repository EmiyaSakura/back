const express = require('express');
const router = express.Router();
const {jwtAuth, decode} = require('../utils/jwt-token'); // 引入jwt认证函数

const universalRouter = require('../routes/universalRouter');
const normalRouter = require('../routes/normalRouter');
const rootRouter = require('../routes/rootRouter');

router.use(jwtAuth); // 注入认证模块
router.use('/universal', universalRouter)
router.use('/normal', normalRouter)
router.use('/root', [(req,resp,next) => {
    let {role} = decode(req);
    if (role === 'root'){
        next()
    }
    else {
        resp.status(402).end();
    }
}], rootRouter)

module.exports = router;
