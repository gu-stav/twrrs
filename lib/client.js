'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const Twitter = require('twit');
const winston = require('winston');

const routeDefaults = require('./defaults');

const askClient = function(params, credentials) {
  const client = new Twitter(credentials);
  let endpoint = params.url || 'statuses/user_timeline';
  let endpointParams = _.omit(params, ['url']);
  let endpointParamsDefaults = routeDefaults[endpoint] || {};

  _.defaults(endpointParams, endpointParamsDefaults);

  return new Promise(function(resolve, reject) {
    if(!endpoint) {
      return reject(new Error('URL parameter has to be defined'));
    }

    winston.info('Query: ', endpoint, endpointParams);

    client.get(endpoint, endpointParams, function(err, data, response) {
      if(err) {
        return reject(err);
      }

      return resolve(data);
    });
  });
};

module.exports = {
  askFor: askClient,
};
