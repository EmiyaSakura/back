const {queryOne} = require("../utils/index");
const {querySql} = require("../utils");

module.exports = {
    findAppointment(account) {
        const query = `select a.code,
                              doctor,
                              date,
                              material,
                              h.name as h_name,
                              h.fee,
                              d.name as d_name,
                              h.code as h_code,
                              d.code as d_code
                       from appointment a
                                join hospital h on a.hospital = h.code
                                join department d on a.department = d.code
                       where account = '${account}'
                         and a.deleted = 0`;
        return querySql(query);
    },
    findAppointmentWithDoctor(account) {
        const query = `select a.code,
                              doctor,
                              date,
                              material,
                              evaluation,
                              avatar,
                              d.name,
                              d.level,
                              d.fee,
                              h.name as h_name,
                              h.level as h_level,
                              de.name as d_name
                       from appointment a
                                join doctor d on a.doctor = d.account
                                join user u on a.doctor = u.account
                                join hospital h on d.h_code = h.code
                                join department de on d.d_code = de.code
                       where a.account = '${account}'
                         and a.deleted = 0`;
        return querySql(query);
    },
    findAppointmentCount(doctor) {
        const query = `select *
                       from appointment 
                       where doctor = '${doctor}'`;
        return querySql(query);
    },
    insertAppointment(data) {
        const query = `insert into appointment
                       set ?`;
        return queryOne(query, data);
    },
    updateAppointment(data) {
        const query = `update appointment
                       set ?
                       where code = ?`;
        return queryOne(query, data);
    },
    deleteAppointment(code) {
        const query = `update appointment
                       set deleted = 1
                       where code = '${code}'`;
        return queryOne(query);
    },
    allAppointment() {
        const query = `select count(*) as count
                       from appointment`;
        return queryOne(query);
    },
}
