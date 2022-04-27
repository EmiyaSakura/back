const {queryOne} = require("../utils/index");
const {querySql} = require("../utils");

module.exports = {
    findHospitalDepartmentByCode(code) {
        const query = `select *
                       from hospital_department
                       where code = '${code}'
                         and deleted = 0`;
        return queryOne(query);
    },
    findHospitalDepartment(hospital) {
        const query = `select d_code as code, d.name
                       from hospital_department hd
                                join department d on hd.d_code = d.code
                       where h_code = '${hospital}'
                         and hd.deleted = 0`;
        return querySql(query);
    },
    selectHospitalDepartment() {
        const query = `select hd.code,
                              h_code,
                              d_code,
                              h.name as h_name,
                              d.name as d_name
                       from hospital_department hd
                                join hospital h on hd.h_code = h.code
                                join department d on hd.d_code = d.code
                       where hd.deleted = 0
                       order by h_code desc `;
        return querySql(query);
    },
    searchHospitalDepartment(search) {
        const query = `select hd.code,
                              h_code,
                              d_code,
                              h.name as h_name,
                              d.name as d_name
                       from hospital_department hd
                                join hospital h on hd.h_code = h.code
                                join department d on hd.d_code = d.code
                       where hd.deleted = 0
                         and (hd.code like '%${search}%' or h.name like '%${search}%' or
                              d.name like '%${search}%')
                       order by h_code desc `;
        return querySql(query);
    },
    insertHospitalDepartment(data) {
        const query = `insert into hospital_department
                       set ?`;
        return queryOne(query, data);
    },
    updateHospitalDepartment(data) {
        const query = `update hospital_department
                       set ?
                       where code = ?`;
        return queryOne(query, data);
    },
    deleteHospitalDepartment(list) {
        const query = `update hospital_department
                       set deleted = 1
                       where code in (${list})`;
        return queryOne(query);
    },
    allHospitalDepartment() {
        const query = `select count(*) as count
                       from hospital_department`;
        return queryOne(query);
    },
}
