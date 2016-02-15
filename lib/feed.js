'use strict';

const _ = require('lodash');
const RSS = require('rss');
const twitterText = require('twitter-text');

const createFeedData = function(user) {
  return {
    title: user.name,
    description: user.description,
    image_url: user.profile_image_url_https,
    site_url: user.url,
  };
};

const createFeed = function(data, user) {
  const rss = new RSS(createFeedData(user));

  return [rss, data];
};

const addItemsToFeed = function(feed, data) {
  _.forEach(data, function(tweet) {
    feed.item({
      description: twitterText.autoLink(tweet.text),
      url: tweet.url,
      author: tweet.user.name,
    });
  });

  return [feed, data];
};

const getXML = function(feed) {
  return feed.xml();
};

module.exports = {
  create: createFeed,
  addItems: addItemsToFeed,
  getXML: getXML,
};
