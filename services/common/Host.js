const { CoreService, CoreException } = require('../../core/CallService')



const service = {

    transaction: true,
    task: null,
    input: function (request) {
        return {
            host: request.header('host')
        }
    },

    prepare: async function (input, db) {
        return input;
    },

    process: async function (input, OriginalInput, db) {

        return input
    },
    validation: {
    }
}


module.exports = CoreService(service)