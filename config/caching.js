const autoBind = require('auto-bind');
const config = require('./config').getConfig();


class Caching {
    constructor() {
        autoBind(this);   
    }  
}


module.exports = new Caching();