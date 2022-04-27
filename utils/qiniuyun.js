const qiniuyun = require("qiniu");

// 创建上传凭证
const accessKey = 'vtmK5JFNoGDIBFmcAcYVfUAEy3x-MAmuNFU1nV7e';    //accessKey
const secretKey = 'f-PzJZyM9ELMrhbXiRZxO0QvdKrYveG6NW9jk-eT';    //secretKey

const uploadToken = (key) => {
    const putPolicy = new qiniuyun.rs.PutPolicy({
        scope: 'emiyasakura:' + key,         //对象存储空间名字
        expires: 7200
    });
    return putPolicy.uploadToken(new qiniuyun.auth.digest.Mac(accessKey, secretKey));
}

module.exports = {
    uploadToken
};