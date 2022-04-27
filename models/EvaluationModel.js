const {queryOne} = require("../utils/index");
const {querySql} = require("../utils");

module.exports = {
    findEvaluation(code) {
        const query = `select *
                       from evaluation 
                       where code = '${code}'`;
        return queryOne(query);
    },
    findEvaluationWithDoctor(doctor) {
        const query = `select *
                       from evaluation
                       where doctor = '${doctor}'
                       order by createTime desc `;
        return querySql(query);
    },
    findEvaluationAvgScore(doctor) {
        const query = `select avg(score) as avg_score
                       from evaluation
                       where doctor = '${doctor}'`;
        return queryOne(query);
    },
    insertEvaluation(data) {
        const query = `insert into evaluation
                       set ?`;
        return queryOne(query, data);
    },
    updateEvaluation(data) {
        const query = `update evaluation
                       set ?
                       where code = ?`;
        return queryOne(query, data);
    },
    allEvaluation() {
        const query = `select count(*) as count
                       from evaluation`;
        return queryOne(query);
    },
}
