module.exports = function(env) {
  return [
    {
      consumer_key: env.twitter_consumer_key,
      consumer_secret: env.twitter_consumer_secret,
      access_token: env.twitter_access_token,
      access_token_secret: env.twitter_access_token_secret,
    },
  ];
};
