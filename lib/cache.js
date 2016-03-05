'use strict';

const crypto = require('crypto');
const moment = require('moment');
const Promise = require('bluebird');
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
  return crypto.createHash('md5').update(endpointData.toLowerCase()).digest("hex");
}

const find = function(endpoint, params, ignore_last_accessed) {
  return sync()
    .then(function() {
      if(ignore_last_accessed === undefined) {
        ignore_last_accessed = false;
      }

      let queryData = {
        where: {
          endpoint: hashEndpoint(endpoint, params),
        },
      };

      if(!ignore_last_accessed) {
        queryData.where.last_accessed = {
          $gt: moment().subtract(1, 'h'),
        };
      }

      return RequestModel.findAll(queryData);
    })
    .then(function(data) {
      if(data.length === 0) {
        return [undefined, data];
      }

      return [JSON.parse(data[0].data), data];
    });
};

const create = function(endpoint, params, data) {
  return sync()
  /* Delete old data of this endpoint */
  .then(function() {
    return find(endpoint, params, true)
      .spread(function(data, raw) {
        return Promise.each(raw, function(entry) {
          return entry.destroy({
            force: true,
          });
        });
      });
  })
  .then(function() {
    let queryData = {
      endpoint: hashEndpoint(endpoint, params),
      data: JSON.stringify(data),
      last_accessed: new Date(),
    };

    return RequestModel.create(queryData);
  });
};

module.exports = {
  get: find,
  set: create,
};
