'use strict';
const express = require( 'express' ), 
router = express.Router();
const AuthController = require( '../../controllers/AuthController' );
const CourseController = require( '../../controllers/CourseController' );


router.get( '/', AuthController.checkLogin, AuthController.isAdmin, CourseController.courses);
router.get( '/chuyen-nganh', AuthController.checkLogin, AuthController.isAdmin, CourseController.getAll);
router.get( '/chuyen-nganh/them-moi', AuthController.checkLogin, AuthController.isAdmin, CourseController.getcoursesNew);
router.get( '/chuyen-nganh/:id/cap-nhat', AuthController.checkLogin, AuthController.isAdmin, CourseController.getcoursesUpdate);
module.exports = router;
