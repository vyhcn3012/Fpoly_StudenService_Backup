'use strict';
const IndexController = require( '../../controllers/IndexController' );
const express = require( 'express' ), 
router = express.Router();
const AuthController = require( '../../controllers/AuthController' );

router.get( '/', AuthController.checkLogin, IndexController.index );

router.get( '/dao-tao', AuthController.checkLogin, AuthController.isEducation, IndexController.education );
// lấy danh sách chuyển ngành cho màn hình đào tạo
router.get( '/dao-tao/chuyen-nganh-hoc', AuthController.checkLogin, AuthController.isEducation, IndexController.getChangeCoursePaperForEducation);
router.get( '/dao-tao/chuyen-nganh-hoc/sua/:id', AuthController.checkLogin, AuthController.isEducation, IndexController.getChangeCoursePaperForEducationToFixUpdate);
router.get('/dao-tao/chuyen-nganh-hoc/them-moi', AuthController.checkLogin, AuthController.isEducation, IndexController.getChangeCoursePaperForEducationToUpdate);


router.get( '/tai-vu', AuthController.checkLogin, AuthController.isFinance, IndexController.finance );
// lấy danh sách chuyển ngành cho màn hình đào tạo
router.get( '/tai-vu/chuyen-nganh-hoc', AuthController.checkLogin, AuthController.isFinance, IndexController.getChangeCoursePaperForFinance );
router.get('/tai-vu/them-moi/:id', AuthController.checkLogin, AuthController.isFinance, IndexController.getChangeCoursePaperForFinanceToUpdate);


router.get( '/dich-vu-sinh-vien', AuthController.checkLogin, AuthController.isStudentService, IndexController.studentService );
// lấy danh sách chuyển ngành cho màn hình đào tạo
router.get( '/dich-vu-sinh-vien/chuyen-nganh-hoc', AuthController.checkLogin, AuthController.isStudentService, IndexController.getChangeCoursePaperForStudentService );
router.get( '/dich-vu-sinh-vien/chuyen-nganh-hoc/them-moi', AuthController.checkLogin, AuthController.isStudentService, IndexController.getChangeCoursePaperNewPage );


module.exports = router;
