const { CoreService, CoreException } = require('../../core/CallService')

const service = {


    transaction: false,
    task: null,
    input: function (request) {
        return request.query
    },

    prepare: async function (input, db) {
        return input;
    },

    process: async function (input, OriginalInput, db) {
        return (await db('users').count())[0].count
    },

    validation: {

    }
}


module.exports = CoreService(service)