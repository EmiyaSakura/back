const {queryOne} = require("../utils/index");
const {querySql} = require("../utils");

module.exports = {
    findReserveVideo(account) {
        const query = `select *
                       from reserve_video
                       where account = '${account}'`;
        return querySql(query);
    },
    insertReserveVideo(account, code) {
        const query = `insert into reserve_video(account, code)
                       values ('${account}', '${code}')`;
        return queryOne(query);
    },
    updateReserveVideo(account, code, remind) {
        const query = `update reserve_video
                       set remind = '${remind}'
                       where account = '${account}'
                         and code = '${code}'`;
        return queryOne(query);
    },
    deleteReserveVideo(account, code) {
        const query = `delete
                       from reserve_video
                       where account = '${account}'
                         and code = '${code}'`;
        return queryOne(query);
    },
}
