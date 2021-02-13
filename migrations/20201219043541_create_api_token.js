
exports.up = async function (knex) {
    await knex.schema
        .createTable('api_token', function (table) {
            table.bigInteger('user_id').index()
            table.string('api_token', 100).index()
        })

};

exports.down = function (knex) {

};
