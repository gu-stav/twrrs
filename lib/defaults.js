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
    },
    mapping: {
      feed: tweetMapping,
    },
  },
};

module.exports = routeDefaults;
