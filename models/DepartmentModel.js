const {queryOne} = require("../utils/index");
const {querySql} = require("../utils");

module.exports = {
    findDepartmentByCode(code) {
        const query = `select *
                       from department
                       where code = '${code}'
                         and deleted = 0`;
        return queryOne(query);
    },
    selectDepartment() {
        const query = `select *
                       from department
                       where deleted = 0
                       order by createTime desc `;
        return querySql(query);
    },
    searchDepartment(search) {
        const query = `select *
                       from department
                       where deleted = 0
                         and (code like '%${search}%' or name like '%${search}%')
                       order by createTime desc `;
        return querySql(query);
    },
    insertDepartment(data) {
        const query = `insert into department
                       set ?`;
        return queryOne(query, data);
    },
    updateDepartment(data) {
        const query = `update department
                       set ?
                       where code = ?`;
        return queryOne(query, data);
    },
    deleteDepartment(list) {
        const query = `update department
                       set deleted = 1
                       where code in (${list})`;
        return queryOne(query);
    },
    allDepartment() {
        const query = `select count(*) as count
                       from department`;
        return queryOne(query);
    },
}
