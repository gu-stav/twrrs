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
    let tweetUrl = 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str;
    let tweetText = twitterText.autoLink(tweet.full_text || tweet.text);

    _.forEach(tweet.entities.media, function(entity) {
      let replacementUrl = entity.url;
      let mediaUrl = entity.media_url_https;
      let mediaLink = entity.expanded_url;

      switch(entity.type) {
        case 'photo':
          let markup = '<a href="' + mediaLink + '">' +
                         '<img src="' + mediaUrl + '" alt="" />' +
                        '</a>';
          tweetText += markup;
          break;
      }
    });

    feed.item({
      title: tweet.user.name,
      guid: tweet.id,
      description: tweetText,
      url: tweetUrl,
      author: tweet.user.name,
      date: tweet.created_at,
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
