const md5 = require('../utils/md5');
const {CODE_SUCCESS, CODE_ERROR} = require('../utils/constant');
const {decode} = require("../utils/jwt-token");
const qiniuToken = require("../utils/qiniuyun");

const UserModel = require('../models/UserModel');
const VideoModel = require("../models/VideoModel");
const ReserveVideoModel = require("../models/ReserveVideoModel");
const DoctorModel = require("../models/DoctorModel");
const DepartmentModel = require("../models/DepartmentModel");
const ChatModel = require("../models/ChatModel");
const ChatTipModel = require("../models/ChatTipModel");
const AppointmentModel = require("../models/AppointmentModel");
const MaterialModel = require("../models/MaterialModel");
const HospitalDepartmentModel = require("../models/HospitalDepartmentModel");
const HospitalModel = require("../models/HospitalModel");
const EvaluationModel = require("../models/EvaluationModel");
const VerifyCodeModel = require("../models/VerifyCodeModel");

module.exports = {
    // 通过token获取用户信息
    async getUser(req, resp) {
        let {account} = decode(req);

        let user = await UserModel.findUser(account)
        user = {
            account: user.account,
            nick_name: user.nick_name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
        }

        if (user.role === 'doctor') {
            let doctor = await DoctorModel.findDoctorByAccount(account)
            if (doctor) {
                user.name = doctor.name
                user.level = doctor.level
            }
        }

        return resp.json({
            code: CODE_SUCCESS, message: '', info: user
        })
    },
    // 通过账号获取用户信息
    async findUser(req, resp) {
        let {account} = req.body;

        let user = await UserModel.findUser(account)
        user = {
            account: user.account,
            name: user.nick_name,
            avatar: user.avatar,
        }

        return resp.json({
            code: CODE_SUCCESS, message: '', info: user
        })
    },
    // 修改昵称
    async updateNickName(req, resp) {
        let {account} = decode(req);
        let {name} = req.body;

        let user = {
            nick_name: name
        }
        await UserModel.updateUser([user, account])

        return resp.json({
            code: CODE_SUCCESS, message: '', info: null
        });
    },
    async updateEmail(req, resp) {
        let result = {code: CODE_ERROR, message: '数据不合法', info: null}
        let {account} = decode(req);
        let {email, code} = req.body;
        let res = await VerifyCodeModel.findEmailCode(email, code)
        if (!res || res.length === 0) {
            result.message = '验证码错误或失效'
        } else {
            let user = {
                email
            }

            await UserModel.updateUser([user, account])
            await VerifyCodeModel.deleteEmailCode(email)
            result.code = CODE_SUCCESS
        }
        return resp.json(result)
    },
    async updatePassword(req, resp) {
        let result = {code: CODE_ERROR, message: '数据不合法', info: null}
        let {account} = decode(req);
        let {password, pwd} = req.body;

        const user = await UserModel.verifyUser(account, md5(password))
        if (!user || user.length === 0) {
            result.message = '旧密码错误'
        } else {
            if (password === pwd){
                result.message = '新旧密码不能一致'
            }
            else {
                let user = {
                    password: md5(pwd)
                }

                await UserModel.updateUser([user, account])
                result.code = CODE_SUCCESS
            }
        }
        return resp.json(result)
    },
    // getQiniuToken(req, resp) {
    //     let {key} = req.body;
    //     return resp.json({
    //         code: CODE_SUCCESS, message: '', info: qiniuToken.uploadToken(key)
    //     });
    // },
    // 获取直播信息集合
    async getVideo(req, resp) {
        let {account} = decode(req);

        let reserving = [];
        let past = [];
        let reserved = [];
        const video = await VideoModel.findVideo()
        const reserve = await ReserveVideoModel.findReserveVideo(account)

        video.forEach(e => {
            if (Date.parse(e.date) >= new Date(new Date(new Date().toLocaleDateString()).getTime())) {
                e.reserved = false
                for (const r of reserve) {
                    if (r.code === e.code) {
                        e.reserved = true
                        e.remind = !!r.remind
                        reserved.push(e)
                        break;
                    }
                }
                reserving.push(e)
            } else {
                past.push(e)
            }
        })

        past = past.reverse()

        return resp.json({
            code: CODE_SUCCESS, message: '', info: {reserving, past, reserved}
        })
    },
    // 预约直播
    async reserveVideo(req, resp) {
        let {account} = decode(req);
        let {code, reserve} = req.body;

        if (reserve) {
            await ReserveVideoModel.insertReserveVideo(account, code)
        } else {
            await ReserveVideoModel.deleteReserveVideo(account, code)
        }

        return resp.json({
            code: CODE_SUCCESS, message: '', info: null
        })
    },
    // 直播设置提醒
    async remindVideo(req, resp) {
        let {account} = decode(req);
        let {code, remind} = req.body;

        await ReserveVideoModel.updateReserveVideo(account, code, remind ? 1 : 0)

        return resp.json({
            code: CODE_SUCCESS, message: '', info: null
        })
    },
    // 获取科室集合
    async findDepartment(req, resp) {
        const res = await DepartmentModel.selectDepartment()
        return resp.json({code: CODE_SUCCESS, message: '', info: res});
    },
    // 获取医生
    async getDoctor(req, resp) {
        let {account} = req.body
        let doctor = await DoctorModel.getDoctor(account)

        let res = await AppointmentModel.findAppointmentCount(account)
        doctor.count = res.length
        let to = await ChatModel.findChatToChat(account)
        let from = await ChatModel.findChatFromChat(account)
        doctor.rate = (from.length / to.length).toFixed(2) * 100 + '%'
        res = await EvaluationModel.findEvaluationAvgScore(account)
        doctor.avg_score = res.avg_score

        return resp.json({code: CODE_SUCCESS, message: '', info: doctor});
    },
    // 获取医生集合
    async findDoctor(req, resp) {
        let {search} = req.body
        const doctors = await DoctorModel.findDoctor(search)

        for (const doctor of doctors) {
            let res = await AppointmentModel.findAppointmentCount(doctor.account)
            doctor.count = res.length
            let to = await ChatModel.findChatToChat(doctor.account)
            let from = await ChatModel.findChatFromChat(doctor.account)
            doctor.rate = (from.length / to.length).toFixed(2) * 100 + '%'
            res = await EvaluationModel.findEvaluationAvgScore(doctor.account)
            doctor.avg_score = res.avg_score
        }

        return resp.json({code: CODE_SUCCESS, message: '', info: doctors});
    },
    // 新增或修改医生
    async updateDoctor(req, resp) {
        let {account} = decode(req);
        let {name, h_code, d_code, level, fee, major, introduction} = req.body

        let doctor = await DoctorModel.getDoctor(account)
        if (doctor) {
            doctor = {
                name, h_code, d_code, level, fee, major, introduction
            }
            await DoctorModel.updateDoctor([doctor, account])
        } else {
            doctor = {
                account, name, h_code, d_code, level, fee, major, introduction
            }
            await DoctorModel.insertDoctor(doctor)

            let user = {
                role: 'doctor'
            }
            await UserModel.updateUser([user, account])
        }

        return resp.json({code: CODE_SUCCESS, message: '', info: null})
    },
    // 获取咨询记录
    async findChat(req, resp) {
        let {account} = decode(req);
        let {chat} = req.body
        const res = await ChatModel.findChat(account, chat)
        return resp.json({code: CODE_SUCCESS, message: '', info: res});
    },
    // 新增咨询记录
    async insertChat(req, resp) {
        let {account} = decode(req);
        let {to_chat, type, info} = req.body
        let chat = {
            from_chat: account, to_chat, type, info
        }
        await ChatModel.insertChat(chat)
        return resp.json({code: CODE_SUCCESS, message: '', info: null});
    },
    // 获取消息记录
    async findChatTip(req, resp) {
        let {account} = decode(req);
        let normal = await ChatTipModel.selectChatTip(account)
        let doctor = await ChatTipModel.selectChatTipForDoctor(account)
        let system = await ChatTipModel.selectChatTipForSystem(account)
        return resp.json({
            code: CODE_SUCCESS, message: '', info: {
                normal, doctor, system
            }
        });
    },
    // 新增系统消息
    async insertChatTip(req, resp) {
        let {account} = decode(req);
        let {chat} = req.body

        let res = await ChatTipModel.allChatTip()
        let count = String(res.count).padStart(6, '0')
        let chatTip = {
            code: count, account, chat, type: 'system'
        }
        await ChatTipModel.insertChatTip(chatTip)

        return resp.json({code: CODE_SUCCESS, message: '', info: null})
    },
    // 新增或修改咨询消息
    async updateChatTip(req, resp) {
        let {account} = decode(req);
        let {chat} = req.body

        let chatTip = await ChatTipModel.findChatTip(account, chat)
        if (!chatTip) {
            let res = await ChatTipModel.allChatTip()
            let count = String(res.count).padStart(6, '0')
            chatTip = {
                code: count, account, chat, type: 'normal'
            }
            await ChatTipModel.insertChatTip(chatTip)
            res = await ChatTipModel.allChatTip()
            count = String(res.count).padStart(6, '0')
            chatTip = {
                code: count, account: chat, chat: account, type: 'doctor'
            }
            await ChatTipModel.insertChatTip(chatTip)
        }

        return resp.json({code: CODE_SUCCESS, message: '', info: null})
    },
    // 删除消息记录
    async deleteChatTip(req, resp) {
        let {code} = req.body

        await ChatTipModel.deleteChatTip(code)
        return resp.json({code: CODE_SUCCESS, message: '', info: null})
    },
    // 获取预约挂号记录
    async getAppointment(req, resp) {
        let {account} = decode(req);

        let reserving = [];
        let reserved = [];
        let appointment = await AppointmentModel.findAppointment(account)
        let doctor = await AppointmentModel.findAppointmentWithDoctor(account)

        appointment = appointment.concat(doctor)
        appointment.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))

        appointment.forEach(e => {
            if (Date.parse(e.date) >= new Date()) {
                reserving.push(e)
            } else {
                reserved.push(e)
            }
        })

        return resp.json({
            code: CODE_SUCCESS, message: '', info: {reserving, reserved}
        })
    },
    // 新增预约挂号记录
    async insertAppointment(req, resp) {
        let {account} = decode(req);
        let {hospital, department, doctor, date, material} = req.body

        let res = await AppointmentModel.allAppointment()
        let count = String(res.count).padStart(6, '0')
        let appointment = {
            code: md5(count), account, hospital, department, doctor, date, material
        }
        await AppointmentModel.insertAppointment(appointment)

        return resp.json({code: CODE_SUCCESS, message: '', info: null})
    },
    // 删除预约挂号记录
    async deleteAppointment(req, resp) {
        let {code} = req.body

        await AppointmentModel.deleteAppointment(code)

        return resp.json({code: CODE_SUCCESS, message: '', info: null})
    },
    // 获取患者信息
    async getMaterial(req, resp) {
        let {code} = req.body

        let material = await MaterialModel.getMaterial(code)

        return resp.json({code: CODE_SUCCESS, message: '', info: material})
    },
    // 新增或修改患者信息
    async updateMaterial(req, resp) {
        let {code, name, sex, age, description, medical, health_code, contact, diagnosed, isolation} = req.body

        let material = await MaterialModel.getMaterial(code)

        if (material) {
            material = {
                name, sex, age, description, medical, health_code, contact, diagnosed, isolation
            }
            await MaterialModel.updateMaterial([material, code])
        } else {
            let res = await MaterialModel.allMaterial()
            code = String(res.count).padStart(6, '0')
            material = {
                code, name, sex, age, description, medical, health_code, contact, diagnosed, isolation
            }
            await MaterialModel.insertMaterial(material)
        }

        return resp.json({code: CODE_SUCCESS, message: '', info: code})
    },
    // 获取医院集合
    async findHospital(req, resp) {
        const res = await HospitalModel.selectHospital()
        return resp.json({code: CODE_SUCCESS, message: '', info: res});
    },
    // 获取医院科室集合
    async findHospitalDepartment(req, resp) {
        let {hospital} = req.body

        const res = await HospitalDepartmentModel.findHospitalDepartment(hospital)
        console.log(res)
        return resp.json({code: CODE_SUCCESS, message: '', info: res});
    },
    // 获取评价
    async getEvaluation(req, resp) {
        let {code} = req.body

        const res = await EvaluationModel.findEvaluation(code)

        return resp.json({code: CODE_SUCCESS, message: '', info: res});
    },
    // 获取医生评价集合
    async findEvaluation(req, resp) {
        let {doctor} = req.body

        const res = await EvaluationModel.findEvaluationWithDoctor(doctor)

        return resp.json({code: CODE_SUCCESS, message: '', info: res});
    },
    // 新增或修改评价
    async updateEvaluation(req, resp) {
        let {account} = decode(req);
        let {code, appCode, doctor, comment, score, anonymity} = req.body

        let evaluation = await EvaluationModel.findEvaluation(code)
        let name = '匿名用户';
        if (anonymity === 'false') {
            let user = await UserModel.findUser(account)
            name = user.nick_name
        }
        if (evaluation) {
            evaluation = {
                name, comment, score, anonymity
            }
            await EvaluationModel.updateEvaluation([evaluation, code])
        } else {
            let res = await EvaluationModel.allEvaluation()
            code = String(res.count).padStart(6, '0')
            let evaluation = {
                code, name, doctor, comment, score, anonymity
            }
            await EvaluationModel.insertEvaluation(evaluation)
            let appointment = {
                evaluation: code,
            }
            await AppointmentModel.updateAppointment([appointment, appCode])
        }

        return resp.json({code: CODE_SUCCESS, message: '', info: code})
    },
}
