const express = require('express');
// const bodyParser = require( 'body-parser' );
const logger = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');
const utility = require('../system/helpers/Utility')
const helmet = require('helmet'),
    server = express();
const { setRoutes } = require('./routes');
// For security



// server.use( helmet() );
// server.use(
//     helmet.contentSecurityPolicy({
//       useDefaults: true,
//       directives: {
//         "script-src": ["'self'", "'unsafe-inline'"],
//         "script-src-attr": ["'unsafe-inline'"],
//         "img-src": ["'self'", "2.pik.vn"],
//       },
//     })
//   );
server.use(logger('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.set('views', path.join(__dirname, '../src/views'));
server.set('view engine', 'hbs');
server.use(cookieParser());
server.use(express.static(path.join(__dirname, '../public')));

hbs.registerHelper('formatDate', utility.formatDate);
hbs.registerHelper('formatTime', utility.formatTime);
hbs.registerHelper('index', utility.index);
hbs.registerHelper('getEventStatus', utility.getEventStatus);
hbs.registerHelper('getRole', utility.getRole);
hbs.registerHelper('checkPermission', utility.checkPermission);
hbs.registerHelper('checkTeacher', utility.checkTeacher);
hbs.registerHelper('ifEquals', utility.ifEquals);

const cors = require('cors'),
    // Allow Origins according to your need.
    corsOptions = {
        'origin': '*'
    };

server.use(cors(corsOptions));

// server.use( bodyParser.json() );

// Setting up Routes
setRoutes(server);

process.on('uncaughtException', function (exception) {
    // handle or ignore error
    console.log(exception);
});

module.exports = { server };
