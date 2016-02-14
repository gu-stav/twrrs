const _ = require('lodash');
const accounts = require('./accounts');

const getCredentials = function(env) {
  return _.sample(accounts(env));
};

module.exports = {
  read: getCredentials,
};
