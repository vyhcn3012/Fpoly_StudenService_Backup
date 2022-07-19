const mongoose = require('mongoose');
const { Schema } = require('mongoose');
// const uniqueValidator = require( 'mongoose-unique-validator' );
const config = require('../../config/config').getConfig();

class ChangeCoursePaper {
    static instance = null;
    initSchema() {
        const schema = new Schema({
            'education_accepted_by': {
                'type': Schema.Types.ObjectId,
                'required': true,
                'ref': 'user'
            },
            'education_requested_at': {
                'type': Date,
                'default': new Date(),
                'required': true
            },
            'version': {
                'type': [
                    {
                        'type': Object,
                        'required': true
                    }
                ],
                'required': true,
                'default': [],
            },
            'paper_steps': {
                'type': Number,
                'required': true,
                'default': config.PAPER_STATUS.STEP1
            },
            'finance_status':{
                'type': Number,
                'required': false,
            },
            // step 1: lập phiếu tư vấn
            // 'requested_at': {
            //     type: Date,
            //     default: new Date(),
            //     required: true
            // },
            // 'student_code': {
            //     'type': String,
            //     'required': true,
            // },
            // 'fullname': {
            //     'type': String,
            //     'required': true,
            // },
            // 'current_semester': { // kỳ học cũ
            //     'type': String,
            //     'required': true,
            // },
            // 'current_course': { // ngành học
            //     'type': String,
            //     'required': true,
            // },
            // 'current_major':{ // chuyên ngành hẹp
            //     'type': String,
            //     'required': false,
            // },     
            // 'requested_course': { // ngành mới
            //     'type': String,
            //     'required': true,
            // },  
            // 'requested_major': { // chuyên ngành hẹp mới
            //     'type': String,
            //     'required': true,
            // },    
            // 'requested_semester': { // kỳ học mới
            //     'type': String,
            //     'required': true,
            // },
            // 'requested_reason': { // lý do chuyển ngành
            //     'type': String,
            //     'required': true,
            // },
            // 'new_course_status': { // trạng thái của ngành mới
            //     'type': String,
            //     'required': false,
            //     'default': ''
            // },
            // 'english_level': { // cấp độ tiếng anh
            //      'type': String,
            //     'required': false,
            //     'default': ''
            // }
            // 'new_course_subjects':{ // những môn học cần bổ sung
            //     'type': [
            //         {
            //             'type': Object,
            //             'required': false
            //         }
            //     ],
            //     'required': false,
            // },

            // // step 2: xác nhận phí của tài vụ
            // // nếu tài vụ đồng ý thì cập nhật paper_steps = 2
            // // ngược lại, sẽ cho phép đào tạo cập nhật lại đơn
            // // khi đào tạo cập nhật thì tạo thêm 1 version mới
            // 'finance_status': { // tài vụ xác nhận ( 1. đồng ý, 2. từ chối)
            //     'type': Number,
            //     'required': false,
            // },
            // 'finance_accepted_at': {
            //     'type': Date,
            //     'required': false,
            //     'default': new Date()
            // },
            // 'finance_accepted_by': {
            //     'type': Schema.Types.ObjectId,
            //     'required': false,
            //     'ref': 'user'
            // },
            // // step 3: dich vu sinh vien sẽ chốt            
            // 'student_service_result_by': {
            //     'type': Schema.Types.ObjectId,
            //     'required': false,
            //     'ref': 'user'
            // },
            // 'student_service_result_at': {
            //     'type': Date,
            //     'required': false,
            //     'default': new Date()
            // },
            // 'paper_result': {
            //     'type': Number,
            //     'required': true,
            //     'default': config.PAPER_RESULT.PENDING
            // }
        }, { 'timestamps': true });

        // schema.plugin( uniqueValidator );
        try {
            mongoose.model('ChangeCoursePaper', schema);
        } catch (e) {

        }

    }

    getInstance() {
        if (!ChangeCoursePaper.instance) {
            this.initSchema();
            ChangeCoursePaper.instance = mongoose.model('ChangeCoursePaper');
        }
        return ChangeCoursePaper.instance;
    }
}

module.exports = { ChangeCoursePaper };


let pp = {
    "education_requested_at": {
        "$date": {
            "$numberLong": "1657893109697"
        }
    },
    "education_accepted_by": {
        "$oid": "62b7c9bdcfa3f237fddcd13a"
    },
    "versions": [
        {
            "student_code": "PS16665",
            "fullname": "Nguyễn Anh",
            "current_semester": "Summer 2022",
            "current_course": "Lập trình di động",
            "current_major": "Lập trình đa nền tảng",
            "requested_course": "Thiết kế trang web",
            "requested_major": "Frontend",
            "requested_semester": "Fall 2022",
            "requested_reason": "Thích",
            "new_course_status": 1, // 1: TN2, 2: TN21, 3: HDI
            "english_level": 1, // 1: 1.1, 2: 1.2, 3: 2.1, 4: 2.2
            "new_course_subjects": [
                {
                    "code": "COM107",
                    "fee": "1317000"
                },
                {
                    "code": "COM108",
                    "fee": "1317000"
                },
                {
                    "code": "COM201",
                    "fee": "1317000"
                }
            ],
            "finance_accepted_at": {
                "$date": {
                    "$numberLong": "1657895905652"
                }
            },
            "finance_accepted_by": {
                "$oid": "62b7c9bdcfa3f237fddcd13a"
            },
            "finance_status": 2,
            "paper_steps": 2,
            "student_service_result_at": {
                "$date": {
                    "$numberLong": "1657893023645"
                }
            },
            "student_service_result_by": {
                "$oid": "62b7c9bdcfa3f237fddcd13a"
            },
            "paper_result": 2,
            "updated_at": {
                "$date": {
                    "$numberLong": "1657893109697"
                }
            },
        }
    ]
}

let courses = {
    "course_name": "Thiết kế trang web",
    "available": true,
    "majors": [
        {
            "major_name": "Backend",
            "available": true,
        },
        {
            "major_name": "Frontend",
            "available": true,
        },
    ]
}
