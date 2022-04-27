const DepartmentModel = require("../models/DepartmentModel");
const {CODE_SUCCESS} = require("../utils/constant");
const service = require("./rootService");
const router = require("../routes");
module.exports = {
    async selectDepartment(req, resp) {
        const res = await DepartmentModel.selectDepartment()
        return resp.json({code: CODE_SUCCESS, message: '', info: res});
    },
    async deleteDepartment(req, resp) {
        let {list} = req.body
        list = list.split(',').map(e => `'${e}'`).join(',')
        await DepartmentModel.deleteDepartment(list)
        return resp.json({code: CODE_SUCCESS, message: '删除成功', info: null});
    },
    async updateDepartment(req, resp) {
        let {code, name, level, fee} = req.body

        let department = await DepartmentModel.findDepartmentByCode(code)
        if (department){
            department = {
                name, level, fee
            }
            await DepartmentModel.updateDepartment([department,code])
        }else {
            let res = await DepartmentModel.allDepartment()
            const count = String(res.count).padStart(6, '0')
            department = {
                code: count, name, level, fee
            }
            await DepartmentModel.insertDepartment(department)
        }

        return resp.json({code: CODE_SUCCESS, message: '', info: null})
    },
    async searchDepartment(req, resp) {
        let {search} = req.body
        const res = await DepartmentModel.searchDepartment(search)
        return resp.json({code: CODE_SUCCESS, message: '', info: res});
    },
}

router.get('/selectDepartment', service.selectDepartment);
router.post('/deleteDepartment', service.deleteDepartment);
router.post('/updateDepartment', service.updateDepartment);
router.post('/searchDepartment', service.searchDepartment);
