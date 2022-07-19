const mongoose = require( 'mongoose' );
const { Schema } = require( 'mongoose' );
// const uniqueValidator = require( 'mongoose-unique-validator' );
const config = require('../../config/config').getConfig();


class User {

    initSchema() {
        const schema = new Schema( {
            'code': {
                'type': String,
                'required': false,
                // 'unique': true,
            },
            'name': {
                'type': String,
                'required': false,
            },
            'email': {
                'type': String, 
                // 'unique': true,
                'required': true,
            },
            'avatar': {
                'type': String,
                'required': false,
                'default': true
            },
            'role': {
                'type': Number,
                'required': true,
                'default': config.USER_ROLE.DICH_VU_SINH_VIEN
            },
            'available': {
                'type': Boolean,
                'required': true,
                'default': false,
            },
        }, { 'timestamps': true } );
        
        schema.statics.findByEmail = function( email ) {
            return this.findOne( { 'email': email } );
        };
        // schema.plugin( uniqueValidator );
        try {
            mongoose.model( 'user', schema );
        } catch ( e ) {

        }

    }

    getInstance() {
        this.initSchema();
        return mongoose.model( 'user' );
    }
}

module.exports = { User };
