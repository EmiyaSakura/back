const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')

module.exports = {
    config: {
        host: 'smtp.qq.com', // 服务
        port: 465, // smtp端口
        secure: true,
        auth: {
            user: 'emiya.sakura@qq.com', //用户名
            pass: 'jwrtetnnmokbbcgh' // SMTP授权码
        }
    },
    get transporter() {
        return nodemailer.createTransport(smtpTransport(this.config));
    }
}