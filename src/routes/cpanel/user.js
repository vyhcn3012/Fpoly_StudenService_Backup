'use strict';
const express = require( 'express' ), 
router = express.Router();
const AuthController = require( '../../controllers/AuthController' );
const UserController = require('../../controllers/UserController');

router.get( '/', AuthController.checkLogin, AuthController.isAdmin, UserController.getAll);

module.exports = router;
