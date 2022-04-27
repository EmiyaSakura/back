const express = require('express');
const router = express.Router();

const service = require('../services/rootService');

router.get('/selectUser', service.selectUser);
router.post('/deleteUser', service.deleteUser);
router.post('/updateUser', service.updateUser);
router.post('/searchUser', service.searchUser);
router.post('/resetPwd', service.resetPwd);

router.get('/selectVideo', service.selectVideo);
router.post('/deleteVideo', service.deleteVideo);
router.post('/updateVideo', service.updateVideo);
router.post('/searchVideo', service.searchVideo);

router.get('/selectHospital', service.selectHospital);
router.post('/deleteHospital', service.deleteHospital);
router.post('/updateHospital', service.updateHospital);
router.post('/searchHospital', service.searchHospital);

router.get('/selectDepartment', service.selectDepartment);
router.post('/deleteDepartment', service.deleteDepartment);
router.post('/updateDepartment', service.updateDepartment);
router.post('/searchDepartment', service.searchDepartment);

router.get('/selectHospitalDepartment', service.selectHospitalDepartment);
router.post('/deleteHospitalDepartment', service.deleteHospitalDepartment);
router.post('/updateHospitalDepartment', service.updateHospitalDepartment);
router.post('/searchHospitalDepartment', service.searchHospitalDepartment);

router.get('/selectDoctor', service.selectDoctor);
router.post('/deleteDoctor', service.deleteDoctor);
router.post('/updateDoctor', service.updateDoctor);
router.post('/searchDoctor', service.searchDoctor);


module.exports = router;
