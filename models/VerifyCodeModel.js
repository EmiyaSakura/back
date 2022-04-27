const {queryOne} = require("../utils/index");

module.exports = {
    findEmailCode(account, code) {
        const query = `select *
                       from verify_code
                       where email = '${account}'
                         and code = '${code}'`;
        return queryOne(query);
    },
    insertEmailCode(account, code) {
        const query = `insert into 
                       verify_code(email, code)
                       values ('${account}', '${code}')`;
        return queryOne(query);
    },
    deleteEmailCode(account) {
        const query = `delete from verify_code
                       where email = '${account}'`;
        return queryOne(query);
    }
}
