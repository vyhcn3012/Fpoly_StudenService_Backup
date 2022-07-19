'use strict';
const AuthController = require('../../controllers/AuthController');
const IndexController = require('../../controllers/IndexController');
const express = require('express'),
    router = express.Router();

router.post('/dao-tao/chuyen-nganh-hoc', AuthController.checkLogin, IndexController.postChangeCoursePaperEducation);
router.put('/dao-tao/chuyen-nganh-hoc/cap-nhat', AuthController.checkLogin, IndexController.putChangeCoursePaperEducationUpdate);

router.put('/tai-vu/chuyen-nganh-hoc', AuthController.checkLogin, IndexController.putChangeCoursePaperFinance);
router.put('/tai-vu/chuyen-nganh-hoc/cancel', AuthController.checkLogin, IndexController.putChangeCoursePaperFinanceCancel);

router.post('/dich-vu-sinh-vien/chuyen-nganh-hoc/them-moi', AuthController.checkLogin, IndexController.postChangeCoursePaper);
router.put('/dich-vu-sinh-vien/chuyen-nganh-hoc', AuthController.checkLogin, IndexController.putChangeCoursePaper);
router.put('/dich-vu-sinh-vien/chuyen-nganh-hoc/cap-nhat-trang-thai', AuthController.checkLogin, IndexController.putChangeCoursePaperResult);


router.get('/:id/chuyen-nganh-hoc/', AuthController.checkLogin, IndexController.getOneCoursePaper );



module.exports = router;