
exports.up = function (knex) {
    return knex.schema
        .createTable('roles', function (table) {
            table.bigIncrements('id')
            table.string('role_code', 100).unique().index()
            table.string('role_name', 200)
            table.text('description')
        })

};

exports.down = function (knex) {

};
