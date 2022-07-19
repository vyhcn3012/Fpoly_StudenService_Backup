'use strict';
const express = require( 'express' ), 
router = express.Router();
const AuthController = require( '../../controllers/AuthController' );
const UserController = require('../../controllers/UserController');

router.put( '/:id', AuthController.checkLogin, UserController.cpanel_Update);

module.exports = router;
