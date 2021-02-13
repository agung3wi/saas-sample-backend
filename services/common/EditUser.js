const { CoreService, CoreException } = require('../../core/CallService')
const bcrypt = require('bcryptjs')

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
        var userInput = {
            full_name: input.full_name,
            password: bcrypt.hashSync(input.password),
            role_id: -1
        }
        return (await db(`users`).where("id", input.id).update(userInput).returning("*"))[0]

    },

    validation: {
        id: 'required|integer',
        password: 'required',
        full_name: 'required',
        role_id: 'required|integer'
    }
}


module.exports = CoreService(service)