const { Controller } = require('../../system/controllers/Controller');
const { UserService } = require('../services/UserService');
const { User } = require('../models/User');
const autoBind = require('auto-bind');
const userService = new UserService(new User().getInstance());
const config = require('../../config/config').getConfig();
const utility = require('../../system/helpers/Utility')

class UserController extends Controller {

    constructor(service) {
        super(service);
        autoBind(this);
    }

    async getAll(req, res, next) {
        try {
            const { _id, role } = req.user;
            const { size, page } = req.query;
            const previous = 1;
            const response = await userService.getAll({ limit: 1000 }, role);
            let users = response.data;
            users = users.map(item => {
                if (utility.checkPermission(item._id, item.role, _id, role)) {
                    item = { ...item, isEditable: true };
                } else {
                    item = { ...item, isEditable: false };
                }
                return item;
            })
            res.render('user/index', {
                currentYear: new Date().getFullYear(),
                users: users,
                _users: JSON.stringify(users),
            });
        } catch (e) {
            next(e);
        }
    }

    async cpanel_Update(req, res, next) {
        try {
            const { _id, role } = req.user;
            const { id } = req.params;
            const { available, newRole } = req.body;
            console.log(">>>> new role: ", newRole);
            if(typeof available === "undefined"){
                const data = {
                    role: newRole,
                    updatedAt: new Date(),
                    updatedBy: _id,
                    _id: id,
                }
                const response = await this.service.cpanel_Update(id, data, role)
                return res.status(response.statusCode).json(response);
            }else{
                const data = {
                    available: available ,
                    role: newRole,
                    updatedAt: new Date(),
                    updatedBy: _id,
                    _id: id,
                }
                const response = await this.service.cpanel_Update(id, data, role)
                return res.status(response.statusCode).json(response);
            }

        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController(userService);
