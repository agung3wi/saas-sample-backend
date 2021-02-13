
exports.up = function (knex) {
    return knex.schema
        .createTable('tasks', function (table) {
            table.bigIncrements('id')
            table.string('task_name', 100).unique().index()
            table.string('task_group', 200)
            table.text('description')
        })

};

exports.down = function (knex) {

};
