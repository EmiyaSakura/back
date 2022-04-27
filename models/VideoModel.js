const {queryOne} = require("../utils/index");
const {querySql} = require("../utils");

module.exports = {
    findVideo() {
        const query = `select *
                       from video
                       where deleted = 0
                       order by date`;
        return querySql(query);
    },
    findVideoByCode(code) {
        const query = `select *
                       from video
                       where code = '${code}' and deleted = 0`;
        return queryOne(query);
    },
    selectVideo() {
        const query = `select *
                       from video
                       where deleted = 0
                       order by createTime desc `;
        return querySql(query);
    },
    searchVideo(search) {
        const query = `select *
                       from video
                       where deleted = 0
                         and (code like '%${search}%' or title like '%${search}%'
                           or author like '%${search}%' or identity like '%${search}%' or date like '%${search}%' or
                              url like '%${search}%')
                       order by createTime desc `;
        return querySql(query);
    },
    insertVideo(data) {
        const query = `insert into video
                       set ?`;
        return queryOne(query, data);
    },
    updateVideo(data) {
        const query = `update video
                       set ?
                       where code = ?`;
        return queryOne(query, data);
    },
    deleteVideo(list) {
        const query = `update video
                       set deleted = 1
                       where code in (${list})`;
        return queryOne(query);
    },
    allVideo() {
        const query = `select count(*) as count
                       from video`;
        return queryOne(query);
    },
}
