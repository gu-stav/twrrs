'use strict';

const client = require('./lib/client');
const credentials = require('./lib/credentials');
const feed = require('./lib/feed');
const express = require('express');

const settings = {
  port: 3000,
  credentials: credentials.read(process.env),
};

let app = express();

app.get('/rss/', function(req, res) {
  client.askFor(req.query, settings.credentials)
    .then(feed.create)
    .spread(feed.addItems)
    .spread(feed.getXML)
    .then(function(xmlStr) {
      res.status(200).send(xmlStr);
    });
});

app.listen(settings.port, function() {
  console.log('Example app listening on port ' + settings.port + '!');
});
