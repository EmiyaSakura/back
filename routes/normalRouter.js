const express = require('express');
const router = express.Router();

const service = require('../services/normalService');

router.get('/getUser', service.getUser);
router.post('/findUser', service.findUser);
router.post('/updateNickName', service.updateNickName);
router.post('/updateEmail', service.updateEmail);
router.post('/updatePassword', service.updatePassword);
// router.post('/getQiniuToken', service.getQiniuToken);
router.get('/getVideo', service.getVideo);
router.post('/reserveVideo', service.reserveVideo);
router.post('/remindVideo', service.remindVideo);
router.get('/findDepartment', service.findDepartment);
router.post('/getDoctor', service.getDoctor);
router.post('/findDoctor', service.findDoctor);
router.post('/updateDoctor', service.updateDoctor);
router.post('/findChat', service.findChat);
router.post('/insertChat', service.insertChat);
router.get('/findChatTip', service.findChatTip);
router.post('/insertChatTip', service.insertChatTip);
router.post('/updateChatTip', service.updateChatTip);
router.post('/deleteChatTip', service.deleteChatTip);
router.get('/getAppointment', service.getAppointment);
router.post('/insertAppointment', service.insertAppointment);
router.post('/deleteAppointment', service.deleteAppointment);
router.post('/getMaterial', service.getMaterial);
router.post('/updateMaterial', service.updateMaterial);
router.get('/findHospital', service.findHospital);
router.post('/findHospitalDepartment', service.findHospitalDepartment);
router.post('/getEvaluation', service.getEvaluation);
router.post('/findEvaluation', service.findEvaluation);
router.post('/updateEvaluation', service.updateEvaluation);

module.exports = router;
