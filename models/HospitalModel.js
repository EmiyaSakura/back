const {queryOne} = require("../utils/index");
const {querySql} = require("../utils");

module.exports = {
    findHospitalByCode(code) {
        const query = `select *
                       from hospital
                       where code = '${code}'
                         and deleted = 0`;
        return queryOne(query);
    },
    selectHospital() {
        const query = `select *
                       from hospital
                       where deleted = 0
                       order by createTime desc `;
        return querySql(query);
    },
    searchHospital(search) {
        const query = `select *
                       from hospital
                       where deleted = 0
                         and (code like '%${search}%' or name like '%${search}%'
                           or level like '%${search}%' or fee like '%${search}%')
                       order by createTime desc `;
        return querySql(query);
    },
    insertHospital(data) {
        const query = `insert into hospital
                       set ?`;
        return queryOne(query, data);
    },
    updateHospital(data) {
        const query = `update hospital
                       set ?
                       where code = ?`;
        return queryOne(query, data);
    },
    deleteHospital(list) {
        const query = `update hospital
                       set deleted = 1
                       where code in (${list})`;
        return queryOne(query);
    },
    allHospital() {
        const query = `select count(*) as count
                       from hospital`;
        return queryOne(query);
    },
}
