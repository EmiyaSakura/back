const md5 = require('../utils/md5');
const {CODE_SUCCESS} = require('../utils/constant');

const UserModel = require('../models/UserModel');
const VideoModel = require('../models/VideoModel');
const HospitalModel = require("../models/HospitalModel");
const DepartmentModel = require("../models/DepartmentModel");
const HospitalDepartmentModel = require("../models/HospitalDepartmentModel");
const DoctorModel = require("../models/DoctorModel");

module.exports = {
    async selectUser(req, resp) {
        const res = await UserModel.selectUser()
        return resp.json({code: CODE_SUCCESS, message: '', info: res});
    },
    async deleteUser(req, resp) {
        let {list} = req.body
        list = list.split(',').map(e => `'${e}'`).join(',')
        await UserModel.deleteUser(list)
        return resp.json({code: CODE_SUCCESS, message: '删除成功', info: null});
    },
    async updateUser(req, resp) {
        let {account, name, email, role} = req.body

        let user = await UserModel.findUser(account)
        if (user){
            user = {
                nick_name: name,
                email: email,
                role: role,
            }
            await UserModel.updateUser([user,account])
        }else {
            let res = await UserModel.allUser()
            const count = String(res.count).padStart(6, '0')
            user = {
                account: count,
                password: md5(count),
                nick_name: name,
                email: email,
                avatar: 'http://sakura.i8329.cn/%E8%8D%A7.webp',
                role: role,
            }
            await UserModel.insertUser(user)
        }

        return resp.json({code: CODE_SUCCESS, message: '', info: null})
    },
    async searchUser(req, resp) {
        let {search} = req.body
        const res = await UserModel.searchUser(search)
        return resp.json({code: CODE_SUCCESS, message: '', info: res});
    },
    async resetPwd(req, resp) {
        let {account} = req.body

        let user = {
            password:md5('000000')
        }
        await UserModel.updateUser([user,account])
        return resp.json({code: CODE_SUCCESS, message: '重置成功', info: null});
    },

    async selectVideo(req, resp) {
        const res = await VideoModel.selectVideo()
        return resp.json({code: CODE_SUCCESS, message: '', info: res});
    },
    async deleteVideo(req, resp) {
        let {list} = req.body
        list = list.split(',').map(e => `'${e}'`).join(',')
        await VideoModel.deleteVideo(list)
        return resp.json({code: CODE_SUCCESS, message: '删除成功', info: null});
    },
    async updateVideo(req, resp) {
        let {code, title, author, identity, date, url} = req.body

        let video = await VideoModel.findVideoByCode(code)
        if (video){
            video = {
                title, author, identity, date, url
            }
            await VideoModel.updateVideo([video,code])
        }else {
            let res = await VideoModel.allVideo()
            const count = String(res.count).padStart(6, '0')
            video = {
                code: count, title, author, identity, date, url
            }
            await VideoModel.insertVideo(video)
        }

        return resp.json({code: CODE_SUCCESS, message: '', info: null})
    },
    async searchVideo(req, resp) {
        let {search} = req.body
        const res = await VideoModel.searchVideo(search)
        return resp.json({code: CODE_SUCCESS, message: '', info: res});
    },

    async selectHospital(req, resp) {
        const res = await HospitalModel.selectHospital()
        return resp.json({code: CODE_SUCCESS, message: '', info: res});
    },
    async deleteHospital(req, resp) {
        let {list} = req.body
        list = list.split(',').map(e => `'${e}'`).join(',')
        await HospitalModel.deleteHospital(list)
        return resp.json({code: CODE_SUCCESS, message: '删除成功', info: null});
    },
    async updateHospital(req, resp) {
        let {code, name, level, fee} = req.body

        let hospital = await HospitalModel.findHospitalByCode(code)
        if (hospital){
            hospital = {
                name, level, fee
            }
            await HospitalModel.updateHospital([hospital,code])
        }else {
            let res = await HospitalModel.allHospital()
            const count = String(res.count).padStart(6, '0')
            hospital = {
                code: count, name, level, fee
            }
            await HospitalModel.insertHospital(hospital)
        }

        return resp.json({code: CODE_SUCCESS, message: '', info: null})
    },
    async searchHospital(req, resp) {
        let {search} = req.body
        const res = await HospitalModel.searchHospital(search)
        return resp.json({code: CODE_SUCCESS, message: '', info: res});
    },

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
        let {code, name, typical} = req.body

        let department = await DepartmentModel.findDepartmentByCode(code)
        if (department){
            department = {
                name, typical
            }
            await DepartmentModel.updateDepartment([department,code])
        }else {
            let res = await DepartmentModel.allDepartment()
            const count = String(res.count).padStart(6, '0')
            department = {
                code: count, name, typical
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

    async selectHospitalDepartment(req, resp) {
        const res = await HospitalDepartmentModel.selectHospitalDepartment()
        return resp.json({code: CODE_SUCCESS, message: '', info: res});
    },
    async deleteHospitalDepartment(req, resp) {
        let {list} = req.body
        list = list.split(',').map(e => `'${e}'`).join(',')
        await HospitalDepartmentModel.deleteHospitalDepartment(list)
        return resp.json({code: CODE_SUCCESS, message: '删除成功', info: null});
    },
    async updateHospitalDepartment(req, resp) {
        let {code, h_code, d_code} = req.body

        let hospitalDepartment = await HospitalDepartmentModel.findHospitalDepartmentByCode(code)
        if (hospitalDepartment){
            hospitalDepartment = {
                h_code, d_code
            }
            await HospitalDepartmentModel.updateHospitalDepartment([hospitalDepartment,code])
        }else {
            let res = await HospitalDepartmentModel.allHospitalDepartment()
            const count = String(res.count).padStart(6, '0')
            hospitalDepartment = {
                code: count, h_code, d_code
            }
            await HospitalDepartmentModel.insertHospitalDepartment(hospitalDepartment)
        }

        return resp.json({code: CODE_SUCCESS, message: '', info: null})
    },
    async searchHospitalDepartment(req, resp) {
        let {search} = req.body
        const res = await HospitalDepartmentModel.searchHospitalDepartment(search)
        return resp.json({code: CODE_SUCCESS, message: '', info: res});
    },

    async selectDoctor(req, resp) {
        const res = await DoctorModel.selectDoctor()
        return resp.json({code: CODE_SUCCESS, message: '', info: res});
    },
    async deleteDoctor(req, resp) {
        let {list} = req.body
        list = list.split(',').map(e => `'${e}'`).join(',')
        await DoctorModel.deleteDoctor(list)
        return resp.json({code: CODE_SUCCESS, message: '删除成功', info: null});
    },
    async updateDoctor(req, resp) {
        let {account, name, h_code, d_code, level, fee, major, info} = req.body

        let doctor = await DoctorModel.findDoctorByAccount(account)
        if (doctor){
            doctor = {
                name, h_code, d_code, level, fee, major, info
            }
            await DoctorModel.updateDoctor([doctor,account])
        }else {
            doctor = {
                account, name, h_code, d_code, level, fee, major, info
            }
            await DoctorModel.insertDoctor(doctor)
        }

        return resp.json({code: CODE_SUCCESS, message: '', info: null})
    },
    async searchDoctor(req, resp) {
        let {search} = req.body
        const res = await DoctorModel.searchDoctor(search)
        return resp.json({code: CODE_SUCCESS, message: '', info: res});
    },
}
