'use strict';
const { Service } = require('../../system/services/Service');
const autoBind = require('auto-bind');
const config = require('../../config/config').getConfig();
const { HttpResponse } = require('../../system/helpers/HttpResponse');


class CourseService extends Service {
    constructor(model) {
        super(model);
        this.model = model;
        autoBind(this);
    }
    async create(body) {
        try {
            
            let { course_name, majors} = body;
                const data = {
                    course_name,
                    majors:majors,
                }
                const item = await this.model.create(data);
                if (item) {
                    return new HttpResponse(item);
                }
                throw new Error('Có lỗi, bạn có thể thử lại sau');
            
        } catch (error) {
            throw new Error(error.message || 'Có lỗi, bạn có thể thử lại sau');
        }
    }
    async getBycourse_name(name) {
        const checkcourse_name=await this.model.find({course_name: name});
        if(checkcourse_name){
            return new HttpResponse(checkcourse_name);
        }
        throw new Error('Có lỗi, bạn có thể thử lại sau');
        
    }
    async getById(id) {
        const checkcourse_name=await this.model.findById(id);
        if(checkcourse_name){
            return new HttpResponse(checkcourse_name);
        }
        throw new Error('Có lỗi, bạn có thể thử lại sau');
        
    }
    async deleteMajor(id) {
        const checkmajor=await this.model.findByIdAndDelete(id);
        if ( !checkmajor ) {
            const error = new Error( 'Item not found' );

            error.statusCode = 404;
            throw error;
        } else {
            return new HttpResponse( checkmajor, { 'deleted': true } );
        }
    }

    async getAll(query) {
        let { skip, limit, sortBy } = query;

        skip = skip ? Number(skip) : 0;
        limit = limit ? Number(limit) : 10;
        sortBy = sortBy ? sortBy : { 'createdAt': -1 };

        delete query.skip;
        delete query.limit;
        delete query.sortBy;

        // must call redis first

        try {
            const res = await this.model
                .find(query)
                .sort(sortBy)
                .skip(skip)
                .limit(limit),
                total = await this.model.countDocuments( query );
            return new HttpResponse(res,{ 'totalCount': total });
        } catch (errors) {
            throw new Error('Có lỗi, bạn có thể thử lại sau');
        }
    }


}

module.exports = { CourseService };
