const {queryOne} = require("../utils/index");
const {querySql} = require("../utils");

module.exports = {
    findChat(a, b) {
        const query = `select *
                       from chat
                       where (from_chat = '${a}' and to_chat = '${b}')
                          or (from_chat = '${b}' and to_chat = '${a}')
                       order by createTime desc `;
        return querySql(query);
    },
    findChatFromChat(doctor) {
        const query = `select distinct to_chat
                       from chat
                       where from_chat = '${doctor}'`;
        return querySql(query);
    },
    findChatToChat(doctor) {
        const query = `select distinct from_chat
                       from chat
                       where to_chat = '${doctor}'`;
        return querySql(query);
    },
    insertChat(data) {
        const query = `insert into chat
                       set ?`;
        return queryOne(query, data);
    },
}
