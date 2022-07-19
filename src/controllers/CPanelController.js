const { AuthService } = require('../services/AuthService');
const { UserService } = require('../services/UserService');
const { Auth } = require('../models/Auth');
const { User } = require('../models/User');
const autoBind = require('auto-bind');
const google = require('googleapis').google, OAuth2 = google.auth.OAuth2;
const config = require('../../config/config').getConfig();
const { OAuth2Client } = require('google-auth-library'), client = new OAuth2Client(config.GOOGLE_CLIENT_ID)
const authService = new AuthService(new Auth().getInstance(), new User().getInstance());
const userService = new UserService(new User().getInstance());
const mongoose = require('mongoose');



class CPanelController {

    constructor() {
        autoBind(this);
    }

    async index(req, res, next) {
        try {
            if (req.cookies && req.cookies.token) {
                res.redirect('/');
                return;
            }
            res.render('auth/index');
        } catch (e) {
            console.log(e);
        }
    }

    auth(req, res, next) {
        if (req.cookies && req.cookies.token) {
            res.redirect('/');
            return;
        }
        const oauth2Client = new OAuth2(config.GOOGLE_CLIENT_ID, config.GOOGLE_CLIENT_SECRET, config.GOOGLE_REDIRECT_URL);
        const authLink = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: config.GOOGLE_SCOPE,
            prompt: 'consent'
        });
        res.redirect(authLink);
    }

    callback(req, res, next) {
        try {
            const oauth2Client = new OAuth2(config.GOOGLE_CLIENT_ID, config.GOOGLE_CLIENT_SECRET, config.GOOGLE_REDIRECT_URL);
            if (req.query.error) {
                res.redirect('/auth');
            } else {
                oauth2Client.getToken(req.query.code, async function (err, token) {
                    if (err) res.redirect('/');
                    else {
                        const ticket = await client.verifyIdToken({
                            idToken: token.id_token,
                            audience: config.GOOGLE_CLIENT_ID
                        });
                        const { name, email, picture } = ticket.getPayload();
                        let check = config.FPT_MAIL_ADMIN.filter(item => email.indexOf(item))[0];
                        if (!check) {
                            const error = new Error('Vui lòng kiểm tra email');
                            error.statusCode = 422;
                            next(error);
                        }

                        let user = await userService.findByEmail(email);
                        if (!user) {
                            const body = {
                                code: email.slice(0, email.indexOf('@')).toString().toUpperCase(),
                                email: email,
                                name: name,
                                avatar: picture,
                                role: config.USER_ROLE.EMPLOYEE,
                                available: false,
                                data: []
                            }
                            user = await userService.register(body);
                            user = user.data;
                        }
                        if(user.available==false) {
                            const error = new Error('Bạn không còn hoạt động trong hệ thống');
                            error.statusCode = 422;
                            next(error);
                            return;
                        }
                        const _token = await authService.model.generateToken(user);
                        await authService.model.create({ 'token': _token, 'user': new mongoose.mongo.ObjectId(user._id) });

                        res.cookie('token', _token, { expires: new Date(Date.now() + config.COOKIE_TOKEN_LIFETIME), httpOnly: true });
                        res.redirect('/');
                    }
                });
            }
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {

            const { token } = req;
            await authService.logout(token);
            res.clearCookie('token');
            res.redirect('/auth');
        } catch (e) {
            console.log(e);
        }
    }




}

module.exports = new CPanelController();
