const data = require('../data.json');

exports.seed = (knex) => knex('trails').del()
  .then(() => knex('trails').insert(data))
  .then(() => knex.raw("SELECT setval('trails_id_seq', (SELECT MAX(id) FROM trails));"));
