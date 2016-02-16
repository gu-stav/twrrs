'use strict';

const _ = require('lodash');
const cache = require('./cache');
const Promise = require('bluebird');
const Twitter = require('twit');
const winston = require('winston');

const routeDefaults = require('./defaults');

const askClient = function(params, credentials) {
  let endpoint = params.url || 'statuses/user_timeline';
  let endpointParams = _.omit(params, ['url']);
  let endpointParamsDefaults = routeDefaults[endpoint] || {};

  _.defaults(endpointParams, endpointParamsDefaults);

  return cache.get(endpoint, endpointParams)
    .then(function(data) {
      if((_.isArray(data) && data.length > 0) ||
         (_.isObject(data) && _.keys(data).length > 0)) {
        winston.info('Cache: ', endpoint);
        return data;
      }

      return new Promise(function(resolve, reject) {
        const client = new Twitter(credentials);

        if(!endpoint) {
          return reject(new Error('URL parameter has to be defined'));
        }

        winston.info('Query: ', endpoint, endpointParams);

        client.get(endpoint, endpointParams, function(err, data, response) {
          if(err) {
            return reject(err);
          }

          return cache.set(endpoint, endpointParams, data)
            .then(function() {
              return resolve(data);
            });
        });
      });
    });
};

module.exports = {
  askFor: askClient,
};
