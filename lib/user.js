'use strict';

const Promise = require('bluebird');

const getUserData = function(query) {
  let  data = {
    url: 'users/show',
  };

  if(query.user_id) {
    data.user_id = query.user_id;
  } else if(query.screen_name) {
    data.screen_name = query.screen_name;
  }

  return data;
};

module.exports = {
  data: getUserData,
};
