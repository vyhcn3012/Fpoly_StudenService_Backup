const { AuthService } = require( './../services/AuthService' );
const { Auth } = require( './../models/Auth' );
const { User } = require( './../models/User' );
const autoBind = require( 'auto-bind' );
const config = require('../../config/config').getConfig();
const bcrypt = require( 'bcrypt' ),
    SALT_WORK_FACTOR = 10,
    authService = new AuthService(
        new Auth().getInstance(), new User().getInstance()
    );

class AuthController {

    constructor( service ) {
        this.service = service;
        autoBind( this );
    }

    async login( req, res, next ) {
        try {
            const response = await this.service.login( req.body.email, req.body.password );

            await res.status( response.statusCode ).json( response );
        } catch ( e ) {
            next( e );
        }
    }
    

    async logout( req, res, next ) {
        try {
            const response = await this.service.logout( req.token );

            await res.status( response.statusCode ).json( response );
        } catch ( e ) {
            next( e );
        }
    }

    async checkLogin( req, res, next ) {
        try {
            const token = this.extractToken( req );
            const response = await this.service.checkLogin( token );

            req.user = response;
            req.authorized = true;
            req.token = token;
            next();
        } catch ( e ) {
            next( e );
        }
    }

    extractToken( req ) {
        if ( req.headers.authorization && req.headers.authorization.split( ' ' )[ 0 ] === 'Bearer' ) {
            return req.headers.authorization.split( ' ' )[ 1 ];
        } else if ( req.query && req.query.token ) {
            return req.query.token;
        } else if (req.cookies && req.cookies.token) {
            return req.cookies.token;
        }
        return null;
    }

    //Middware for check role

    async isAdmin( req, res, next ) {
        if(req.user.role >= config.USER_ROLE.ADMIN){
            next();
        }else{
            res.status(401).json({
                statusCode: 401,
                message: 'Bạn không đủ quyền truy cập.'
            });
        }
    }

    async isEmployee( req, res, next ) {
        if(req.user.role == config.USER_ROLE.EMPLOYEE || req.user.role >= config.USER_ROLE.ADMIN){
            next();
        }else{
            res.status(401).json({
                statusCode: 401,
                message: 'Bạn không đủ quyền truy cập.'
            });
        }
    }

    async isStudentService( req, res, next ) {
        if(req.user.role == config.USER_ROLE.STUDENT_SERVICE || req.user.role >= config.USER_ROLE.ADMIN){
            next();
        }else{
            res.status(401).json({
                statusCode: 401,
                message: 'Bạn không đủ quyền truy cập.'
            });
        }
    }

    async isFinance( req, res, next ) {
        if(req.user.role == config.USER_ROLE.FINANCE || req.user.role >= config.USER_ROLE.ADMIN){
            next();
        }else{
            res.status(401).json({
                statusCode: 401,
                message: 'Bạn không đủ quyền truy cập.'
            });
        }
    }

    async isEducation( req, res, next ) {
        if(req.user.role == config.USER_ROLE.EDUCATION || req.user.role >= config.USER_ROLE.ADMIN){
            next();
        }else{
            res.status(401).json({
                statusCode: 401,
                message: 'Bạn không đủ quyền truy cập.'
            });
        }
    }

}

module.exports = new AuthController( authService );
