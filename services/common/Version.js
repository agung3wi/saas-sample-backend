const { CoreService, CoreException } = require('../../core/CallService')

/**
 * Service Version
 */

const service = {


    transaction: false,
    task: null,
    input: function (request) {
        return request.params
    },

    prepare: async function (input, db) {
        return input;
    },

    process: async function (input, OriginalInput, db) {
        return { version: process.env.APP_VERSION }
    },
    validation: {

    }
}


module.exports = CoreService(service)