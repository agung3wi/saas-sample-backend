require('dotenv').config()

var express = require('express')
var path = require('path')
var cors = require('cors')
const { CoreResponse } = require('./core/CallService')

var app = express();

app.use(cors());

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// register service
var commonRouter = require('./core/coreServiceProvider')
app.use('', commonRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    return CoreResponse.fail(res, "Page Not Found", {}, 404);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    return CoreResponse.fail(res, err.message, {}, err.status || 500);
});

// glboal function

global.is_blank = function (value) {
    return (value === undefined || value == null || value == '')
}

module.exports = app;