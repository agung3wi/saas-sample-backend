
exports.up = function (knex) {

    return knex.schema
        .createTable('role_task', function (table) {
            table.bigInteger('role_id').index()
            table.bigInteger('task_id').index()
        })
};

exports.down = function (knex) {

};
