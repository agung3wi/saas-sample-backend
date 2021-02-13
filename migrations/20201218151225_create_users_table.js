
exports.up = function (knex) {
    return knex.schema
        .createTable('users', function (table) {
            table.bigIncrements('id');
            table.string('username', 25).unique().notNullable();
            table.string('full_name', 255).notNullable();
            table.string('password', 255).notNullable();
            table.bigInteger('role_id');
        })
};

exports.down = function (knex) {

};
