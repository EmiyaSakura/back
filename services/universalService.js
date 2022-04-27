const md5 = require('../utils/md5');
const jwt = require('jsonwebtoken');
const {CODE_ERROR, CODE_SUCCESS, PRIVATE_KEY, JWT_EXPIRED} = require('../utils/constant');
const Email = require('../utils/email');

const UserModel = require('../models/UserModel');
const VerifyCodeModel = require("../models/VerifyCodeModel");

module.exports = {
    // 登录
    async login(req, resp) {
        let result = {code: CODE_ERROR, message: '数据不合法', info: null}
        let {account, password} = req.body

        const user = await UserModel.verifyUser(account, md5(password))
        if (!user || user.length === 0) {
            result.message = '用户名或密码错误'
        } else {
            // 登录成功，签发一个token并返回给前端
            const token = jwt.sign({
                    account: user.account,
                    role:user.role
                },// payload：签发的 token 里面要包含的一些数据。
                PRIVATE_KEY,    // 私钥
                {expiresIn: JWT_EXPIRED},  // 设置过期时间
                null
            );
            result.code = CODE_SUCCESS
            result.info = {token, role: user.role}
        }
        return resp.json(result);
    },
    // 注册
    async register(req, resp) {
        let result = {code: CODE_ERROR, message: '数据不合法', info: null}
        let {email, password, code} = req.body
        const user = await UserModel.findUser(email)
        if (user) {
            result.message = '用户已存在'
        } else {
            let res = await VerifyCodeModel.findEmailCode(email, code)
            if (!res || res.length === 0) {
                result.message = '验证码错误或失效'
            } else {
                res = await UserModel.allUser()
                const count = String(res.count).padStart(6, '0')
                let user = {
                    account: count,
                    password: md5(password),
                    nick_name: '用户' + count,
                    email: email,
                    avatar: 'http://sakura.i8329.cn/%E8%8D%A7.webp',
                    role: 'normal',
                }

                await UserModel.insertUser(user)
                await VerifyCodeModel.deleteEmailCode(email)
                result.code = CODE_SUCCESS
                result.message = '注册成功'
            }
        }
        return resp.json(result)
    },
    // 忘记密码
    async forget(req, resp) {
        let result = {code: CODE_ERROR, message: '数据不合法', info: null}
        let {email, password, code} = req.body
        const user = await UserModel.findUser(email)
        if (user) {
            let res = await VerifyCodeModel.findEmailCode(email, code)
            if (!res || res.length === 0) {
                result.message = '验证码错误或失效'
            } else {
                if (user.password === md5(password)) {
                    result.message = '新密码不能与旧密码一致'
                } else {
                    user.password = md5(password);
                    await UserModel.updateUser([user, user.account])
                    await VerifyCodeModel.deleteEmailCode(email)
                    result.code = CODE_SUCCESS
                    result.message = '修改密码成功'
                }
            }
        } else {
            result.message = '用户不存在'
        }
        return resp.json(result)
    },
    // 获取验证码
    async verify(req, resp) {
        let email = req.body.email;
        let code = Math.random().toString().substring(2, 6);
        let flag = true
        if (/^[a-z\dA-Z]+[-|a-z\dA-Z._]+@([a-z\dA-Z]+(-[a-z\dA-Z]+)?\.)+[a-z]{2,}$/.test(email)) {
            await Email.transporter.sendMail({
                from: '樱落<emiya.sakura@qq.com>', // 发件邮箱
                to: email, // 收件列表
                subject: '验证你的电子邮件', // 标题
                html: `
                    <p>您好！</p>
                    <p>您正在sakura社区进行验证</p>
                    <p>您的验证码是：<strong style="color: #ff4e2a;">${code}</strong></p>
                    <p>该验证码5分钟内有效</p>` // html 内容
            }, () => {
                flag = false;
            });
        }
        if (flag) {
            await VerifyCodeModel.deleteEmailCode(email)
            await VerifyCodeModel.insertEmailCode(email, code)
            setTimeout(async () => {    //5分钟后失效
                await VerifyCodeModel.deleteEmailCode(email);
            }, 1000 * 60 * 5);
        }
        return resp.json({
            code: flag ? CODE_SUCCESS : CODE_ERROR, message: flag ? '验证码发送成功' : '验证码发送失败', info: null
        })
    },
    // 检查更新
    checkUpdates(req, resp) {
        return resp.json({
            code: CODE_SUCCESS, message: '当前已是最新版本', info: null
        })
    },
}
