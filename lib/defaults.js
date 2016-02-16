const tweetMapping = {
  'description': 'text',
  'url': 'url',
  'author': [
    'user',
    'name',
  ]
};

const routeDefaults = {
  'statuses/user_timeline': {
    settings: {
      include_rts: true,
      contributor_details: true,
      count: 200,
    },
    mapping: {
      feed: tweetMapping,
    },
  },
};

module.exports = routeDefaults;
