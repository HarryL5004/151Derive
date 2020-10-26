var express = require('express');
var router = express.Router();
var {randomInt, derive} = require('../derive.js');
const config = require("config");
const puppeteer = require("puppeteer");
let browser = null;
let page = null;

const getQuotes = (page, topic, stepMin, stepMax, siteMin, siteMax) => {
  let steps = randomInt(stepMin, stepMax);
  let siteNum = randomInt(siteMin, siteMax);
  return quotes = derive(page, topic, steps, siteNum);
}

router.use(async(req, res, next) => {
  if (page == null) {
    browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const newPage = await browser.newPage();
    await newPage.setDefaultNavigationTimeout(config.get("timeout.milliseconds"));
    page = newPage;
  }
  next();
})

router.get('/', async(req, res, next) => {
  let topic = "Google Sheets";
  let quotes = await getQuotes(page, topic, config.get("sheets.minStep"), config.get("sheets.maxStep"), 
                                            config.get("sheets.minSite"), config.get("sheets.maxSite"));
  res.render('sheets', {quote1: quotes[0], quote2: quotes[1], quote3: quotes[2], style: "sheets.css"});
});

router.get('/drive', async(req, res, next) => {
  let topic = "Google Drive";
  let quotes = await getQuotes(page, topic, config.get("sheets.minStep"), config.get("sheets.maxStep"), 
                                            config.get("sheets.minSite"), config.get("sheets.maxSite"));
  res.render('drive', {quote1: quotes[0], quote2: quotes[1], quote3: quotes[2], style: "drive.css"});
});

router.get('/docs', async(req, res, next) => {
  let topic = "Google Docs";
  let quotes = await getQuotes(page, topic, config.get("sheets.minStep"), config.get("sheets.maxStep"), 
                                            config.get("sheets.minSite"), config.get("sheets.maxSite"));
  res.render('docs', {quote1: quotes[0], quote2: quotes[1], quote3: quotes[2], style: "docs.css"});
});

router.get('/calendar', async(req, res, next) => {
  let topic = "Google Calendar";
  let quotes = await getQuotes(page, topic, config.get("sheets.minStep"), config.get("sheets.maxStep"), 
                                            config.get("sheets.minSite"), config.get("sheets.maxSite"));
  res.render('calendar', {quote1: quotes[0], quote2: quotes[1], quote3: quotes[2], style: "calendar.css"});
});

router.get('/search', async(req, res, next) => {
  let topic = "Google Search";
  let quotes = await getQuotes(page, topic, config.get("sheets.minStep"), config.get("sheets.maxStep"), 
                                            config.get("sheets.minSite"), config.get("sheets.maxSite"));
  res.render('search', {quote1: quotes[0], quote2: quotes[1], quote3: quotes[2], style: "search.css"});
});

router.get('/debug', (req, res, next) => {
  res.render('search', {quote1: "hello", quote2: "world", quote3: "foo", style: "search.css"});
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