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
        // if (is_blank(input.session.api_token)) {
        //     throw new CoreException("Anda belum login")
        // }
        // if (is_blank(input.session.user_id)) {
        //     throw new CoreException("Anda belum login")
        // }
        return input;
        // return input;
    },

    process: async function (input, OriginalInput, db) {

        await db('api_token')
            .where('api_token', input.session.api_token)
            .where('user_id', input.session.user_id)
            .del();

        return { message: "Berhasil Logout" }
    },
    validation: {

    }
}


module.exports = CoreService(service)