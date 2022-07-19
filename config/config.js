'use strict';
const path = require( 'path' );

module.exports.getConfig = () => {
    const config = {
        'MODE': 'Development',
        'PORT': process.env.PORT || 5555,
        // 'MONGO_URL': 'mongodb://127.0.0.1:27017/Emotion?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false',
        'MONGO_URL': 'mongodb+srv://admin:123@cluster01.exbva.mongodb.net/Student_Service?retryWrites=true&w=majority',
        'UPLOAD_PATH': path.resolve( `${__dirname }/../public/uploads` ),
        'UPLOAD_2PIK_PATH': 'https://2.pik.vn/',
        'JWT_SECRET': 'R4ND0M5TR1NG',
        'FPT_MAIL_ADMIN': ['@fpt.edu.vn'],        
        'GOOGLE_CLIENT_ID': '550765995121-n7mdkd8nd3s4ggcjve3pfcdluf99jigk.apps.googleusercontent.com',
        'GOOGLE_PROJECT_ID': '',
        'GOOGLE_CLIENT_SECRET': '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',
        'GOOGLE_REDIRECT_URL': `/auth/callback`,
        'GOOGLE_SCOPE': ['https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email',],
        'COOKIE_TOKEN_LIFETIME': 30 * 24 * 60 * 60 * 1000, // 60 MINUTES IN NANO SECOND
        'JWT_TOKEN_LIFETIME': 30 * 24 * 60 * 60, // 60 MINUTES IN SECOND
        'USER_ROLE': {
            'EMPLOYEE': 1,
            'STUDENT_SERVICE': 2,
            'FINANCE': 3,
            'EDUCATION': 4,
            'STUDENT': 5,
            'ADMIN': 99,
            'SUPER_ADMIN': 100
        },
        'PAPER_STATUS': {
            'STEP1': 1, // đào tạo tiếp nhận
            'STEP2': 2, // tài vụ xác nhận
            'STEP3': 3, // dịch vụ sinh viên xác nhận kết quả
        },
        'FINANCE_STATUS': {
            'ACCEPTED': 1, // tài vụ xác nhận
            'REJECTED': 2, // tài vụ từ chối
        },
        'PAPER_STATUS_OPTIONS' : [
            {
                'value': 1,
                'label': 'Dịch vụ sinh viên tiếp nhận'
            },
            {
                'value': 2,
                'label': 'Đào tạo tiếp nhận'
            },
            {
                'value': 3,
                'label': 'Tài vụ xác nhận'
            }
        ],
        'PAPER_RESULT': {
            'DONE': 1, // hoàn thành, sv đồng ý
            'CANCEL': 2, // huỷ đơn
            'PENDING': 3, 
        },
        
    };

    // Modify for Production
    if ( process.env.NODE_ENV === 'production' ) {
        config.MODE = 'Production';
        config.HOST = `https://fpoly-student-service.herokuapp.com`;        
    } else {
        config.HOST = `http://localhost:${process.env.PORT || 5555}`;
    }
    config.GOOGLE_REDIRECT_URL = `${config.HOST}/auth/callback`;

    return config;
};
