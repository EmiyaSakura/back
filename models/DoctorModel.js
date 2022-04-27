const {queryOne} = require("../utils/index");
const {querySql} = require("../utils");

module.exports = {
    getDoctor(account) {
        const query = `select doctor.account,
                              doctor.name,
                              h_code,
                              d_code,
                              h.name  as h_name,
                              h.level as h_level,
                              d.name  as d_name,
                              doctor.level,
                              doctor.fee,
                              major,
                              introduction,
                              avatar
                       from doctor
                                join hospital h on doctor.h_code = h.code
                                join department d on doctor.d_code = d.code
                                join user on doctor.account = user.account
                       where doctor.account = '${account}'
                         and doctor.deleted = 0`;
        return queryOne(query);
    },
    findDoctor(search) {
        const query = `select doctor.account,
                              doctor.name,
                              h_code,
                              d_code,
                              h.name  as h_name,
                              h.level as h_level,
                              d.name  as d_name,
                              doctor.level,
                              doctor.fee,
                              major,
                              introduction,
                              avatar
                       from doctor
                                join hospital h on doctor.h_code = h.code
                                join department d on doctor.d_code = d.code
                                join user on doctor.account = user.account
                       where doctor.deleted = 0
                         and (h.name like '%${search}%' or d.typical like '%${search}%' or
                              d.name like '%${search}%' or doctor.name like '%${search}%' or
                              doctor.level like '%${search}%' or doctor.fee like '%${search}%' or
                              major like '%${search}%' or introduction like '%${search}%')
                       order by doctor.createTime desc `;
        return querySql(query);
    },
    findDoctorByAccount(account) {
        const query = `select *
                       from doctor
                       where account = '${account}'
                         and deleted = 0`;
        return queryOne(query);
    },
    selectDoctor() {
        const query = `select doctor.account,
                              doctor.name,
                              h_code,
                              d_code,
                              h.name as h_name,
                              d.name as d_name,
                              doctor.level,
                              doctor.fee,
                              major,
                              Introduction
                       from doctor
                                join hospital h on doctor.h_code = h.code
                                join department d on doctor.d_code = d.code
                       where doctor.deleted = 0
                       order by doctor.createTime desc `;
        return querySql(query);
    },
    searchDoctor(search) {
        const query = `select doctor.account,
                              doctor.name,
                              h_code,
                              d_code,
                              h.name as h_name,
                              d.name as d_name,
                              doctor.level,
                              doctor.fee,
                              major,
                              Introduction
                       from doctor
                                join hospital h on doctor.h_code = h.code
                                join department d on doctor.d_code = d.code
                       where doctor.deleted = 0
                         and (doctor.account like '%${search}%' or h.name like '%${search}%' or
                              d.name like '%${search}%' or doctor.name like '%${search}%' or
                              doctor.level like '%${search}%' or doctor.fee like '%${search}%' or
                              major like '%${search}%' or Introduction like '%${search}%')
                       order by doctor.createTime desc `;
        return querySql(query);
    },
    insertDoctor(data) {
        const query = `insert into doctor
                       set ?`;
        return queryOne(query, data);
    },
    updateDoctor(data) {
        const query = `update doctor
                       set ?
                       where account = ?`;
        return queryOne(query, data);
    },
    deleteDoctor(list) {
        const query = `update doctor
                       set deleted = 1
                       where account in (${list})`;
        return queryOne(query);
    },
}
