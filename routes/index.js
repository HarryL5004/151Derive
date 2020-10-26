var express = require('express');
var router = express.Router();
var {randomInt, derive} = require('../derive.js');
const config = require("config");
const puppeteer = require("puppeteer");

let stepMin, stepMax, siteMin, siteMax;
let browser = null;
let page = null;


const getQuotes = (page, topic) => {
  let steps = randomInt(stepMin, stepMax);
  let siteNum = randomInt(siteMin, siteMax);
  return quotes = derive(page, topic, steps, siteNum);
}

router.use(async(req, res, next) => {
  if (browser == null || page == null) {
    browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const newPage = await browser.newPage();
    await newPage.setDefaultNavigationTimeout(config.get("timeout.milliseconds"));
    page = newPage;
  }
  
  if (!stepMin || !stepMax || !siteMin || !siteMax) {
    stepMin = config.get("apps.stepMin");
    stepMax = config.get("apps.stepMax");
    siteMin = config.get("apps.siteMin");
    siteMax = config.get("apps.siteMax");
  }

  next();
})

router.get('/', async(req, res, next) => {
  try {
    let topic = "Google Sheets";
    let quotes = await getQuotes(page, topic);
    res.render('sheets', {quote1: quotes[0], quote2: quotes[1], quote3: quotes[2], style: "sheets.css"});
  } catch (err) {
    next(err);
  }
});

router.get('/drive', async(req, res, next) => {
  try {
    let topic = "Google Drive";
    let quotes = await getQuotes(page, topic);
    res.render('drive', {quote1: quotes[0], quote2: quotes[1], quote3: quotes[2], style: "drive.css"});
  } catch (err) {
    next(err);
  }
});

router.get('/docs', async(req, res, next) => {
  try {
    let topic = "Google Docs";
    let quotes = await getQuotes(page, topic);
    res.render('docs', {quote1: quotes[0], quote2: quotes[1], quote3: quotes[2], style: "docs.css"});
  } catch (err) {
    next(err);
  }
});

router.get('/calendar', async(req, res, next) => {
  try {
    let topic = "Google Calendar";
    let quotes = await getQuotes(page, topic);
    res.render('calendar', {quote1: quotes[0], quote2: quotes[1], quote3: quotes[2], style: "calendar.css"});
  } catch (err) {
    next(err);
  }
});

router.get('/search', async(req, res, next) => {
  try {
    let topic = "Google Search";
    let quotes = await getQuotes(page, topic);
    res.render('search', {quote1: quotes[0], quote2: quotes[1], quote3: quotes[2], style: "search.css"});
  } catch (err) {
    next(err);
  }
});

router.get('/debug', (req, res, next) => {
  res.render('search', {quote1: "hello", quote2: "world", quote3: "foo", style: "search.css"});
});

router.use((req, res, next) => {
  res.render('search', {quote1: "404", quote2: "Request Not Found!", style: "search.css"});
})

router.use((err, req, res, next) => {
  res.render('search', {quote1: "Failed to load your request.", quote2: err.toString()+".",
  quote3: "Please reload this page.", style: "search.css"});
});

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