const mongoose = require( 'mongoose' );
const { Schema } = require( 'mongoose' );

class Media {
    static instance = null;
    initSchema() {
        const schema = new Schema( {
            'originalname': {
                'type': String,
                'required': false,
            },
            'encoding': {
                'type': String,
                'required': false,
            },
            'mimetype': {
                'type': String,
                'required': false,
            },
            'filename': {
                'type': String,
                'required': false,
            },
            'path': {
                'type': String,
                'required': false,
            },
            'size': {
                'type': Number,
                'required': false,
            },
        }, { 'timestamps': true } );

        try {
            mongoose.model( 'media', schema );
        } catch ( e ) {

        }

    }

    getInstance() {
        if (!Media.instance) {
            this.initSchema();
            Media.instance = mongoose.model( 'media' );
        }        
        return Media.instance;
    }
}

module.exports = { Media };
