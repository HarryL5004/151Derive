const config = require("config");

function randomInt(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

async function getPages(page) {
    return await page.evaluate(() => {
        let footer = document.getElementById("foot")
        let tds = footer.getElementsByTagName("td")
        let pages = []
        for (let td of tds) {
            if (td.getElementsByTagName("a").length != 0 && td.getElementsByTagName("a")[0].getAttribute("href").includes("search") && td.getElementsByTagName("a")[0].hasAttribute("aria-label")) {
            pages.push(td.getElementsByTagName("a")[0].getAttribute("href"))
            }
        }
        return pages
    })
}

async function getSites(page) {
    return await page.evaluate(() => {
        let sites = []
        let results = document.getElementsByClassName("g")
        for (let res of results) {
            let rc = res.getElementsByClassName("rc")
            if ( rc.length != 0) {
            sites.push(rc[0].getElementsByClassName("yuRUbf")[0].getElementsByTagName("a")[0].getAttribute("href"))
            }
        }
        return sites
    })
}

async function getQuote(page) {
    return await page.evaluate(() => {
        let pTags = document.querySelectorAll("p");
        if (pTags.length == 0)
            return "...";

        let text = pTags[Math.floor(pTags.length/2)].innerText;
        let splittedText = text.split(". ");

        let index = Math.floor(pTags.length/2);
        let quote = splittedText[0];
        while((quote.trim() == "" || !quote.includes(" ")) && index < pTags.length) {
            text = pTags[index].innerText;
            splittedText = text.split(". ");
            quote = splittedText[0];
            index++;
        }
        return quote;
    })
}

async function derive(page, topic, steps, siteNum) {
    const GoogleURL =  config.get("Google.url");
    topic = topic.replace(" ", "+")
    let quotes = []

    await page.goto(`${GoogleURL}/search?q=${topic}`);
    let pages = await getPages(page);

    for (const i of Array(3).keys()) {
        let pageURL = steps < pages.length ? pages[steps*i] : pages[randomInt(0, Math.floor(pages.length/2))]
        await page.goto(`${GoogleURL}${pageURL}`)
        let sites = await getSites(page);
    
        let siteURL = siteNum < sites.length ? sites[siteNum] : sites[randomInt(0,Math.floor(sites.length/2))]
        await page.goto(siteURL)

        quotes.push(await getQuote(page));
    }
    
    return quotes
}

module.exports = {
    randomInt,
    derive,
};