'use strict';
const AuthController = require('../../controllers/AuthController');
const CourseController = require('../../controllers/CourseController');


const express = require('express'),
    router = express.Router();

router.post('/chuyen-nganh/them-moi', AuthController.checkLogin, CourseController.postMajor);
router.get('/:name/getByCourseName',  CourseController.getByCourseName);
router.delete('/chuyen-nganh/:id/xoa', AuthController.checkLogin, CourseController.deleteMajor);

module.exports = router;