var express = require('express');
var router = express.Router();
var {randomInt, derive} = require('../derive.js');

router.get('/', async function(req, res, next) {
  let topic = "Google Sheets";
  let steps = randomInt(1, 3);
  let siteNum = randomInt(0, 10);
  let quotes = await derive(topic, steps, siteNum);
  res.render('sheets', {quote1: quotes[0], quote2: quotes[1], quote3: quotes[2]});
});

router.get('/drive', async function(req, res, next) {
  let topic = "Google Drive";
  let steps = randomInt(1, 3);
  let siteNum = randomInt(0, 10);
  let quotes = await derive(topic, steps, siteNum);
  res.render('drive', {quote1: quotes[0], quote2: quotes[1], quote3: quotes[2]});
});

router.get('/doc', async function(req, res, next) {
  let topic = "Google Doc";
  let steps = randomInt(1, 3);
  let siteNum = randomInt(0, 10);
  let quotes = await derive(topic, steps, siteNum);
  res.render('doc', {quote1: quotes[0], quote2: quotes[1], quote3: quotes[2]});
});

router.get('/calendar', async function(req, res, next) {
  let topic = "Google Calendar";
  let steps = randomInt(1, 3);
  let siteNum = randomInt(0, 10);
  let quotes = await derive(topic, steps, siteNum);
  res.render('calendar', {quote1: quotes[0], quote2: quotes[1], quote3: quotes[2]});
});

router.get('/search', async function(req, res, next) {
  let topic = "Google Search";
  let steps = randomInt(1, 3);
  let siteNum = randomInt(0, 10);
  let quotes = await derive(topic, steps, siteNum);
  res.render('search', {quote1: quotes[0], quote2: quotes[1], quote3: quotes[2]});
});

router.get('/debug', (req, res, next) => {
  res.render('search', {quote1: "hello", quote2: "world", quote3: "foo"});
})
module.exports = router;
