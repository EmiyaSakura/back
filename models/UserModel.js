const {queryOne} = require("../utils/index");
const {querySql} = require("../utils");

module.exports = {
    // 通过用户名或邮箱查询用户信息
    findUser(account) {
        const query = `select account, nick_name, email, avatar, role
                       from user
                       where account = '${account}'
                          or email = '${account}' and deleted = 0`;
        return queryOne(query);
    },
    selectUser() {
        const query = `select account, nick_name, email, avatar, role
                       from user
                       where deleted = 0
                       order by createTime desc `;
        return querySql(query);
    },
    searchUser(search) {
        const query = `select account, nick_name, email, avatar, role
                       from user
                       where deleted = 0
                         and (account like '%${search}%' or nick_name like '%${search}%'
                           or email like '%${search}%' or role like '%${search}%')
                       order by createTime desc `;
        return querySql(query);
    },
    verifyUser(account, password) {
        const query = `select account, nick_name, email, avatar, role
                       from user
                       where (account = '${account}' or email = '${account}')
                         and password = '${password}'
                         and deleted = 0`;
        return queryOne(query);
    },
    insertUser(data) {
        const query = `insert into user
                       set ?`;
        return queryOne(query, data);
    },
    updateUser(data) {
        const query = `update user
                       set ?
                       where account = ?`;
        return queryOne(query, data);
    },
    deleteUser(list) {
        const query = `update user
                       set deleted = 1
                       where account in (${list})`;
        return queryOne(query);
    },
    allUser() {
        const query = `select count(*) as count
                       from user`;
        return queryOne(query);
    },
}
