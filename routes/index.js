var express = require('express');
var router = express.Router();
var {randomInt, derive} = require('../derive.js');
const config = require("config");
const puppeteer = require("puppeteer");
let browser = null;
let page = null;

const getQuotes = async (page, topic, stepMin, stepMax, siteMin, siteMax) => {
  let steps = randomInt(stepMin, stepMax);
  let siteNum = randomInt(siteMin, siteMax);
  return quotes = await derive(page, topic, steps, siteNum);
}

router.use(async(req, res, next) => {
  if (page == null) {
    browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const newPage = await browser.newPage();
    await newPage.setDefaultNavigationTimeout(0);
    page = newPage;
  }
  next();
})

router.get('/', async function(req, res, next) {
  let topic = "Google Sheets";
  let quotes = await getQuotes(page, topic, config.get("sheets.minStep"), config.get("sheets.maxStep"), 
                                            config.get("sheets.minSite"), config.get("sheets.maxSite"));
  res.render('sheets', {quote1: quotes[0], quote2: quotes[1], quote3: quotes[2]});
});

router.get('/drive', async function(req, res, next) {
  let topic = "Google Drive";
  let quotes = getQuotes(res.app.get('page'), topic, 1, 3, 0, 10);
  res.render('drive', {quote1: quotes[0], quote2: quotes[1], quote3: quotes[2]});
});

router.get('/doc', async function(req, res, next) {
  let topic = "Google Doc";
  let quotes = getQuotes(res.app.get('page'), topic, 1, 3, 0, 10);
  res.render('doc', {quote1: quotes[0], quote2: quotes[1], quote3: quotes[2]});
});

router.get('/calendar', async function(req, res, next) {
  let topic = "Google Calendar";
  let quotes = getQuotes(res.app.get('page'), topic, 1, 3, 0, 10);
  res.render('calendar', {quote1: quotes[0], quote2: quotes[1], quote3: quotes[2]});
});

router.get('/search', async function(req, res, next) {
  let topic = "Google Search";
  let quotes = getQuotes(res.app.get('page'), topic, 1, 3, 0, 10);
  res.render('search', {quote1: quotes[0], quote2: quotes[1], quote3: quotes[2]});
});

router.get('/debug', (req, res, next) => {
  res.render('search', {quote1: "hello", quote2: "world", quote3: "foo"});
})

process.on('SIGTERM', async () => {
  console.info("Shutting down...");
  await browser.close();
});

process.on('SIGINT', async () => {
  console.info("Shutting down...");
  if (browser != null)
    await browser.close();
});

module.exports = router;