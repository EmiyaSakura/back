const {queryOne} = require("../utils/index");


module.exports = {
    getMaterial(code) {
        const query = `select *
                       from material
                       where code = '${code}'`;
        return queryOne(query);
    },
    insertMaterial(data) {
        const query = `insert into material
                       set ?`;
        return queryOne(query, data);
    },
    updateMaterial(data) {
        const query = `update material
                       set ?
                       where code = ?`;
        return queryOne(query, data);
    },
    allMaterial() {
        const query = `select count(*) as count
                       from material`;
        return queryOne(query);
    },
}
