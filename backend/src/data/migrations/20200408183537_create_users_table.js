
exports.up = function(knex) {
    return knex.schema.createTable('users', table => {
        table.string('id').primary();
        table.string('name').notNullable();
        table.binary('picture');
        table.string('bio');
        table.string('interests').notNullable().defaultTo([]);
        table.string('email').notNullable();
        table.string('password').notNullable();
        table.integer('points').defaultTo(0);
        table.string('location');
        table.string('reftoken');
       
    });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
