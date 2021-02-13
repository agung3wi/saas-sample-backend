const bcrypt = require('bcryptjs')

exports.up = async function (knex) {
    var roleInput = {
        id: -1,
        role_code: 'super-admin',
        role_name: 'Super Admin',
        description: ''
    }
    await knex(`roles`).insert(roleInput);

    var taskInput = {
        id: -1,
        task_name: 'super-admin',
        task_group: 'admin',
        description: ''
    }
    await knex(`tasks`).insert(taskInput);


    var userInput = {
        id: -1,
        username: 'admin',
        full_name: 'Admin',
        password: bcrypt.hashSync('admin'),
        role_id: -1
    }
    await knex(`users`).insert(userInput);

    var roleTask = {
        role_id: -1,
        task_id: -1
    }
    await knex(`role_task`).insert(roleTask);

};

exports.down = function (knex) {

};
