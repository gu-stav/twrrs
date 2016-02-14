'use strict';

const _ = require('lodash');
const RSS = require('rss');
const twitterText = require('twitter-text');

const createFeedData = function(data) {
  const ctx = data[0].user;

  const title = ctx.name;
  const description = ctx.description;
  const image_url = ctx.profile_image_url_https;
  const site_url = ctx.url;

  return {
    title: title,
    description: description,
    image_url: image_url,
    site_url: site_url,
  };
};

const createFeed = function(data) {
  const rss = new RSS(createFeedData(data));

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
