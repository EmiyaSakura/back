const mysql = require('mysql');

//连接mysql
function connect() {
    return mysql.createConnection({
        host: 'localhost', // 主机名称，一般是本机
        port: '3306', // 数据库的端口号，如果不设置，默认是3306
        user: 'root', // 创建数据库时设置用户名
        password: 'sakura', // 创建数据库时设置的密码
        database: 'graduation_project_schema',  // 创建的数据库
        connectTimeout: 5000, // 连接超时
        dateStrings : true,
        timezone: "utc"
    })
}

//新建查询连接
function querySql(sql,data) {
    const conn = connect();
    return new Promise((resolve, reject) => {
        try {
            if (data){
                conn.query(sql, data, (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            }else {
                conn.query(sql, (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            }
        } catch (e) {
            reject(e);
        } finally {
            //释放连接
            conn.end();
        }
    })
}

//查询一条语句
function queryOne(sql, data) {
    // console.log(sql)
    return new Promise((resolve, reject) => {
        querySql(sql, data).then(res => {
            // console.log('res===',res)
            if (res && res.length > 0) {
                resolve(res[0]);
            } else {
                resolve(null);
            }
        }).catch(err => {
            reject(err);
        })
    })
}

module.exports = {
    querySql,
    queryOne
}
