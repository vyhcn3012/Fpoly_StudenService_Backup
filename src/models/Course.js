const mongoose = require('mongoose');
const { Schema } = require('mongoose');
// const uniqueValidator = require( 'mongoose-unique-validator' );
const config = require('../../config/config').getConfig();

class Course {
    static instance = null;
    initSchema() {
        const schema = new Schema({
            'course_name': {
                'type': String,
                'required': false,
            },
            'available': {
                'type': Boolean,
                'default': true,
                'required': true,
            },
            'majors': {
                'type': [
                    {
                        'type': Object,
                        'required': true
                    }
                ],
                'required': true,
                'default': [],
            },
        }, { 'timestamps': true });

        // schema.plugin( uniqueValidator );
        try {
            mongoose.model('Course', schema);
        } catch (e) {

        }

    }

    getInstance() {
        if (!Course.instance) {
            this.initSchema();
            Course.instance = mongoose.model('Course');
        }
        return Course.instance;
    }
}

module.exports = { Course };