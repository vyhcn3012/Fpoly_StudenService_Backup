'use strict';
const CPanelController = require( '../../controllers/CPanelController' );
const express = require( 'express' ), 
router = express.Router();
const AuthController = require( '../../controllers/AuthController' );


router.get( '/', CPanelController.index );
router.post( '/', CPanelController.auth );
router.get( '/callback', CPanelController.callback );
router.get( '/logout', AuthController.checkLogin, CPanelController.logout );




module.exports = router;
