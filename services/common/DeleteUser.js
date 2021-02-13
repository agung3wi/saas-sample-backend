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
        await db(`users`).where("id", input.id).del();
        return {
            message: "Berhasil Menghapus User"
        }

    },

    validation: {
        id: 'required|integer'
    }
}


module.exports = CoreService(service)