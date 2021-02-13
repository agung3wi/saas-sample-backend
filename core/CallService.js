const { Validator } = require('node-input-validator');
const jwt = require('jsonwebtoken')
require('dotenv').config()
var pg = require('pg')
pg.types.setTypeParser(pg.types.builtins.INT8, (value) => {
    return parseInt(value);
});
pg.types.setTypeParser(pg.types.builtins.INT8, (value) => {
    return parseInt(value);
});
pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value) => {
    return parseFloat(value);
});



class CoreException {
    constructor(errorMessage = "", errorList = {}, errorCode = 422) {
        this.errorMessage = errorMessage;
        this.errorList = errorList;
        this.errorCode = errorCode;
    }
}

var CoreResponse = {
    ok: function (res, data) {

        var body = {
            success: true,
            data: data
        };
        var statusCode = 200;

        return res.json(body, statusCode);
    },
    fail: function (res, errorMessage = "", errorList = {}, statusCode = 500) {
        var result = {
            success: false,
        }

        if (errorMessage !== "") {
            result.error_message = errorMessage
        }

        if (errorList !== {}) {
            result.error_list = errorList
        }

        return res.json(result, statusCode);
    }
}

const CallService = async function (service, input, db) {
    const validator = new Validator(input, service.validation);

    const matched = await validator.check();
    if (!matched) {
        throw new CoreException("", validator.errors);
    }

    var inputNew = await service.prepare(input, db);
    const inputProcess = (inputNew == null) ? input : inputNew;
    const result = await service.process(inputProcess, input, db);

    return result
}

const ExecuteService = async function (service, input, response, db) {

    try {
        if (service.transaction === true) {
            await db.raw("BEGIN")
        }

        const result = await CallService(service, input, db)
        if (service.transaction === true) {
            await db.raw("COMMIT")
        }

        await db.destroy();
        return CoreResponse.ok(response, result);
    } catch (err) {
        if (service.transaction === true) {
            await db.raw("ROLLBACK")
            await db.destroy();
        }

        if (err instanceof CoreException) {
            return CoreResponse.fail(response, err.errorMessage, err.errorList, err.errorCode);
        } else {
            return CoreResponse.fail(response, err.message);
        }
    }
}


var CoreService = function (service) {
    return {
        exec: async function (event, response) {
            const db = require('knex')({
                client: process.env.DB_DRIVE,
                connection: {
                    host: process.env.DB_HOST,
                    user: process.env.DB_USER,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_DATABASE,
                    port: process.env.DB_PORT || 5432
                }
            });

            db.select = async function (sql, params = []) {
                return db.raw(sql, params)
                    .then(res => {
                        return res.rows;
                    }).catch(err => {
                        throw err;
                    });
            }
            db.row = async function (sql, params = []) {
                return db.select(sql, params)
                    .then(res => {
                        return res[0];
                    }).catch(err => {
                        throw err;
                    });
            }

            var moment = require('moment');
            var inputData = service.input(event);

            var session = {
                datetime: moment().format('YYYYMMDDHHmmss'),
                user_id: null,
                api_token: null
            }
            if (service.task !== undefined && service.task !== null) {
                var token = event.headers.authorization;
                if (token === undefined || token === null) {
                    return CoreResponse.fail(response, "Forbidden", {}, 401);
                }

                try {
                    var claim = jwt.verify(token, process.env.APP_KEY);
                    const result = await db.raw("SELECT 1 FROM api_token WHERE api_token=? AND user_id=?", [claim.api_token, claim.user_id]);
                    if (result.rows.length == 0) {
                        return CoreResponse.fail(response, "Unauthorized", {}, 401);
                    }

                    session.user_id = claim.user_id;
                    session.api_token = claim.api_token;
                } catch (err) {
                    return CoreResponse.fail(response, "Unauthorized", {}, 401);
                }

                if (service.task !== undefined && service.task !== null) {
                    console.log([claim.user_id, service.task])
                    const checkAllowPermission = await db.row(`SELECT 1 FROM tasks A
                    INNER JOIN role_task B ON B.task_id = A.id 
                    INNER JOIN users C ON C.id = ? AND C.role_id = B.role_id
                        WHERE A.task_name = ?`, [claim.user_id, service.task]);
                    if (is_blank(checkAllowPermission)) {
                        return CoreResponse.fail(response, "Unauthorized", {}, 403);
                    }
                }

            } else {
                var token = event.headers.authorization;

                try {
                    var claim = jwt.verify(token, process.env.APP_KEY);
                    const result = await db.raw("SELECT 1 FROM api_token WHERE api_token=? AND user_id=?", [claim.api_token, claim.user_id]);

                    if (result.rows.length > 0) {
                        session.user_id = claim.user_id;
                        session.api_token = claim.api_token;
                    }
                } catch (err) {

                }

            }

            inputData['session'] = session;
            return await ExecuteService(service, inputData, response, db);
        },
        call: async function (input, db) {
            return await CallService(service, input, db);
        }
    }
}


module.exports = { CallService, ExecuteService, CoreException, CoreResponse, CoreService };