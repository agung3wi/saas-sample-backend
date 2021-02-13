const { CoreService, CoreException } = require('../../core/CallService')

const bcrypt = require('bcryptjs')
var sha1 = require('sha1')
var jwt = require('jsonwebtoken')

const service = {

    transaction: true,
    task: null,
    input: function (request) {
        return request.body
    },

    prepare: async function (input, db) {
        return input;
    },

    process: async function (input, OriginalInput, db) {

        var sql = `SELECT A.* FROM users A 
            WHERE A.username= ?`;

        var user = (await db.raw(sql, [input.username])).rows[0];

        if (is_blank(user)) {
            throw new CoreException("Usernama atau Password tidak cocok");
        }

        if (!bcrypt.compareSync(input.password, user.password)) {
            throw new CoreException("Usernama atau Password tidak cocok")
        }

        var api_token = sha1(Math.random(100000, 999999));

        var token = jwt.sign({
            user_id: user.id,
            api_token: api_token
        }, process.env.APP_KEY);

        // sementara drive database
        await db('api_token').insert({
            user_id: user.id,
            api_token: api_token
        });

        return {
            token: token,
            message: "Berhasil Login"
        };
    },
    validation: {
        username: 'required',
        password: 'required'
    }
}


module.exports = CoreService(service)