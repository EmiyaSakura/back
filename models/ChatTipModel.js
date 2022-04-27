const {queryOne} = require("../utils/index");
const {querySql} = require("../utils");

module.exports = {
    findChatTip(account, chat) {
        const query = `select *
                       from chat_tip
                       where account = '${account}'
                         and chat = '${chat}'
                         and deleted = 0`;
        return queryOne(query);
    },
    selectChatTip(account) {
        const query = `select code, avatar, name, chat
                       from chat_tip
                                join user u on chat_tip.chat = u.account
                                join doctor d on chat_tip.chat = d.account
                       where chat_tip.account = '${account}'
                         and type = 'normal'
                         and chat_tip.deleted = 0`;
        return querySql(query);
    },
    selectChatTipForDoctor(account) {
        const query = `select code, avatar, nick_name as name, chat
                       from chat_tip
                                join user u on chat_tip.chat = u.account
                       where chat_tip.account = '${account}'
                         and type = 'doctor'
                         and chat_tip.deleted = 0`;
        return querySql(query);
    },
    selectChatTipForSystem(account) {
        const query = `select *
                       from chat_tip
                       where account = '${account}'
                         and type = 'system'
                         and deleted = 0`;
        return querySql(query);
    },
    insertChatTip(data) {
        const query = `insert into chat_tip
                       set ?`;
        return queryOne(query, data);
    },
    updateChatTip(data) {
        const query = `update chat_tip
                       set ?
                       where code = ?`;
        return queryOne(query, data);
    },
    deleteChatTip(code) {
        const query = `update chat_tip
                       set deleted = 1
                       where code = '${code}'`;
        return queryOne(query);
    },
    allChatTip() {
        const query = `select count(*) as count
                       from chat_tip`;
        return queryOne(query);
    },
}
