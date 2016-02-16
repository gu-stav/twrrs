'use strict';

const crypto = require('crypto');
const moment = require('moment');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('twrss-cache', '', '', {
  dialect: 'sqlite',
  storage: './twrss-cache.sqlite',
  logging: function() {},
});

let RequestModel = sequelize.define('request', {
  endpoint: Sequelize.STRING,
  last_accessed: Sequelize.DATE,
  data: Sequelize.TEXT,
});

const sync = function() {
  return RequestModel.sync();
};

const hashEndpoint = function(endpoint, params) {
  let endpointData = endpoint + JSON.stringify(params);
  return crypto.createHash('md5').update(endpointData).digest("hex");
}

const find = function(endpoint, params) {
  let queryData = {
    where: {
      endpoint: hashEndpoint(endpoint, params),
      last_accessed: {
        $gt: moment().subtract(2, 'h'),
      },
    },
  };

  return sync({
    force: true,
  })
    .then(function() {
      return RequestModel.findAll(queryData);
    })
    .then(function(data) {
      if(data.length === 0) {
        return data;
      }

      return JSON.parse(data[0].data);
    });
};

const create = function(endpoint, params, data) {
  let queryData = {
    endpoint: hashEndpoint(endpoint, params),
    data: JSON.stringify(data),
    last_accessed: moment(),
  };

  return sync({
    force: true,
  }).then(function() {
    return RequestModel.create(queryData);
  });
};

module.exports = {
  get: find,
  set: create,
};
