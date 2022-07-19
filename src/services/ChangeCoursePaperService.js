'use strict';
const { Service } = require('../../system/services/Service');
const autoBind = require('auto-bind');
const { HttpResponse } = require('../../system/helpers/HttpResponse');
const config = require('../../config/config').getConfig();
const { UserService } = require('./UserService');
const { default: mongoose } = require('mongoose');
const { select, log } = require('async');

class ChangeCoursePaperService extends Service {
    constructor(model) {
        super(model);
        this.model = model;
        autoBind(this);
    }

    async create(body, id) {
        try {
            let {
                student_code, fullname, current_semester, current_course, current_major, requested_course,
                requested_semester, requested_reason, new_course_subjects, english_level,
                requested_major
            } = body;

            const data = {
                education_requested_at: new Date(),
                education_accepted_by: id,
                finance_status: '',
                version: {
                    fee_accepted_at: '',
                    fee_accepted_by: '',
                    student_code,
                    requested_major,
                    english_level,
                    fullname,
                    current_semester,
                    current_course,
                    current_major,
                    requested_course,
                    requested_semester,
                    requested_reason,
                    new_course_subjects,
                }  
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

    async financeUpdate(body, idUser) {
        try {
            const {idPaper } = body;
            const paper = await this.model.findOne({ '_id': idPaper});

            const index = paper.version.length - 1;

            const data = {
                [`version.${index}.fee_accepted_at`]: new Date(), 
                [`version.${index}.fee_accepted_by`]: idUser,
                [`finance_status`]: config.FINANCE_STATUS.ACCEPTED,
                [`paper_steps`]: config.PAPER_STATUS.STEP2
            };

            const item = await this.model.findByIdAndUpdate(idPaper, {$set: 
                data}, { new: true });
            return new HttpResponse(item);
        } catch (error) {
            throw new Error(error.message || 'Có lỗi, bạn có thể thử lại sau');
        }
    }

    async financeUpdateCancel(body, idUser) {
        try {
            const {idPaper } = body;
            const paper = await this.model.findOne({ '_id': idPaper});

            const index = paper.version.length - 1;

            const data = {
                [`version.${index}.fee_accepted_at`]: new Date(), 
                [`version.${index}.fee_accepted_by`]: idUser,
                [`finance_status`]: config.FINANCE_STATUS.REJECTED
            };

            const item = await this.model.update({"_id": idPaper}, 
                {$set: data}, { new: true });
            
            return new HttpResponse(item);
        } catch (error) {
            throw new Error(error.message || 'Có lỗi, bạn có thể thử lại sau');
        }
    }
    
    async updatePaperResult(body, id) {
        try {
            const { idPaper, paper_result } = body;
            if(paper_result === "DONE"){
                const data = {
                    paper_result: config.PAPER_RESULT.DONE
                }
                const item = await this.model.findByIdAndUpdate(idPaper, data, { new: true });
                return new HttpResponse(item);
            }else if(paper_result === "CANCEL"){
                const data = {
                    paper_result: config.PAPER_RESULT.CANCEL
                }
                const item = await this.model.findByIdAndUpdate(idPaper, data, { new: true });
                return new HttpResponse(item);
            }else if(paper_result === "PENDING"){
                const data = {
                    paper_result: config.PAPER_RESULT.PENDING
                }
                const item = await this.model.findByIdAndUpdate(idPaper, data, { new: true });
                return new HttpResponse(item);
            }
            
        } catch (error) {
            throw new Error(error.message || 'Có lỗi, bạn có thể thử lại sau');
        }
    }

    async putChangeCoursePaperEducationUpdate(body, id) {
        try {
            let {
                student_code, fullname, current_semester, current_course, current_major, requested_course,
                requested_semester, requested_reason, new_course_subjects, english_level,
                requested_major, idPaper
            } = body;

            const data = {
                    fee_accepted_at: '',
                    fee_accepted_by: '',
                    student_code,
                    requested_major,
                    english_level,
                    fullname,
                    current_semester,
                    current_course,
                    current_major,
                    requested_course,
                    requested_semester,
                    requested_reason,
                    new_course_subjects,
            }

            const item = await this.model.findByIdAndUpdate(idPaper, {$push: {'version': data}, 'finance_status': ''}, { new: true });
            return new HttpResponse(item);
        } catch (error) {
            throw new Error(error.message || 'Có lỗi, bạn có thể thử lại sau');
        }
    }

    async getOneCoursePaper(_id) {
        try {
            const res = await this.model.findOne({ '_id': _id })
                .populate({ path: 'education_accepted_by', select: 'name' })
                .populate({ path: 'fee_accepted_by', select: 'name' });
            return new HttpResponse(res);
        } catch (e) {
            throw new Error('Có lỗi, bạn có thể thử lại sau');
        }
    }

    async update(body, id) {
        try {
            const data = {
                ...body
            }

            const item = await this.model.findByIdAndUpdate(id, data);

            if (item) {
                return new HttpResponse(item);
            }
            throw new Error('Có lỗi, bạn có thể thử lại sau');
        } catch (error) {

        }
    }

    async getStatusAnalys(coursePapers) {
        try {
            //FIXME: Fix caching
            const statusAnalys = config.PAPER_STATUS_OPTIONS.map(item => { return { ...item, count: 0 } });
            coursePapers.forEach(coursePaper => {
                statusAnalys[Number(coursePaper.paper_status) - 1].count++;
            });
            return statusAnalys;
        } catch (error) {
            throw new Error('Có lỗi, bạn có thể thử lại sau');
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
                .limit(limit)
                .populate('updatedBy createdBy')
                .populate({ path: 'education_accepted_by', select: 'name' });
            return new HttpResponse(res);
        } catch (errors) {
            throw new Error('Có lỗi, bạn có thể thử lại sau');
        }
    }


}

module.exports = { ChangeCoursePaperService };
