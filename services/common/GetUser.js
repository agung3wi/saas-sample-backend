const { CoreService, CoreException } = require('../../core/CallService')

/**
 * Service GetUser
 */

const service = {


    transaction: false,
    task: null,
    input: function (request) {
        return request.query
    },

    prepare: async function (input, db) {
        if (is_blank(input.limit))
            input.limit = 10;

        if (is_blank(input.offset))
            input.offset = 0;

        if (input.limit > 1000)
            input.limit = 1000;
        return input;
    },

    process: async function (input, OriginalInput, db) {
        console.log(input)

        return await db.select(['id', 'username', 'full_name', 'role_id']).from('users')
            .limit(input.limit).offset(input.offset)
    },

    validation: {
        limit: 'integer|min:0',
        offset: 'integer|min:0'
    }
}


module.exports = CoreService(service)