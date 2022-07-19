const { Controller } = require('../../system/controllers/Controller');
const autoBind = require('auto-bind');
const { CourseService } = require('../services/CourseService');
const { Course } = require('../models/Course');
const courseService = new CourseService(new Course().getInstance());
const config = require('../../config/config').getConfig();
const utility = require('../../system/helpers/Utility');


class CourseController extends Controller {

    constructor(service) {
        super(service);
        autoBind(this);
    }
    async courses(req, res, next) {
        try {
            res.render('course/index');
        } catch (e) {
            next(e);
        }
    }
    async getAll(req, res, next) {
        try {
            const response = await courseService.getAll({ limit: 1000 });
            let courses=response.data;
            res.render('course/list',{courses: courses,});
        } catch (e) {
            next(e);
        }
    }
    async getcoursesNew(req, res, next) {
        try {
            res.render('course/new');
        } catch (e) {
            next(e);
        }
    }
    async getcoursesUpdate(req, res, next) {
        try {
            const { id } = req.params;
            const response = await courseService.getById(id);
            let courses=response.data;
            res.render('course/update',{Onecourse: courses});
        } catch (e) {
            next(e);
        }
    }
    async getByCourseName(req, res, next) {
        try {
            const { name } = req.params;
            const response = await courseService.getBycourse_name(name);
            return res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }
    async postMajor(req, res, next) {
        try {
            const { body } = req;
            const response = await courseService.create(body);
            return res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }
    async deleteMajor(req, res, next) {
        try {
            const { id } = req.params;
            const response = await courseService.deleteMajor(id);
            return res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }

   
}

module.exports = new CourseController(courseService);
