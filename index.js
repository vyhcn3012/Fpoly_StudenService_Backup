require('dotenv').config();
// Initialize DB Connection
require('./config/database');
require('./config/caching');

// attention, reload cache each restart, every midnight
// require('./config/cache').start();


const config = require('./config/config').getConfig(),
    PORT = config.PORT;
// const { socket } = require('./config/socket');
const http = require('http');
console.log('✔ Bootstrapping Application');
console.log(`✔ Mode: ${config.MODE}`);
console.log(`✔ Port: ${PORT}`);

const { server: app } = require('./config/server');
const server = http.createServer(app);

server.listen(PORT).on('error', (err) => {
    console.log('✘ Application failed to start');
    console.error('✘', err.message);
    process.exit(0);
}).on('listening', () => {
    console.log('✔ Application Started');
});
app.set('view engine', 'hbs');
var hbs = require('hbs');
hbs.registerHelper('checkVersions', function (x, index) {
    let len = x.length - 1;
    if (index == 0)
        var result = x[len].student_code;
    else if (index == 1)
        var result = x[len].fullname;
    else if (index == 2)
        var result = x[len].current_course;
    else if (index == 3)
        var result = x[len].current_major;
    else if (index == 4)
        var result = x[len].current_semester;
    else if (index == 5)
        var result = x[len].requested_course;
    else if (index == 6)
        var result = x[len].requested_major;
    else if (index == 7)
        var result = x[len].requested_semester;
    else if (index == 8){
        if(x[len].paper_result == 1)
            var result = 'Sv đồng ý'
        else if(x[len].paper_result == 2)
            var result = 'hủy đơn'
        else
            var result = 'đang thực hiện'
    } 
    else
        var result = x[len].updated_at;
    console.log(x);
    return result;
});

// socket.io.attach(server);

module.exports = { server };
