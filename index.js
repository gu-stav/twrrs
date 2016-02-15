'use strict';

const client = require('./lib/client');
const credentials = require('./lib/credentials');
const feed = require('./lib/feed');
const express = require('express');
const Promise = require('bluebird');
const user = require('./lib/user');

const settings = {
  port: 3000,
  credentials: credentials.read(process.env),
};

let app = express();

app.get('/rss/', function(req, res) {
  const userData = user.data(req.query);

  Promise.join(
    client.askFor(req.query, settings.credentials),
    client.askFor(userData, settings.credentials),
    function(data, user) {
      return [data, user];
    }
  )
    .spread(feed.create)
    .spread(feed.addItems)
    .spread(feed.getXML)
    .then(function(xmlStr) {
      res.status(200).send(xmlStr);
    });
});

app.listen(settings.port, function() {
  console.log('Example app listening on port ' + settings.port + '!');
});
