const puppeteer = require("puppeteer");
const $ = require('cheerio');
const fs = require('fs');
/**
 *  @description web scrape valorant patch note using puppeteer and cheerio to filter the data
 * 
 */

/*
    links to test on

    https://playvalorant.com/en-us/news/game-updates/valorant-patch-notes-2-01/
    https://playvalorant.com/en-us/news/game-updates/valorant-patch-notes-2-03/
*/

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(
        "https://playvalorant.com/en-us/news/game-updates/valorant-patch-notes-2-01/"
    );

    let content = await page.content();
    /**
     * @var {content}
        read the file, or the link if the lines above were used to read the html
        this was used to prevent over requesting on the website
    */
    //var content = fs.readFileSync('./temp/page.html', 'utf8');

    /**
     * @var {article} 
      we want the characters tables that show the changes of each character in a game update so we found where 
     they all set which were in a div with a css class that can be seen below 

     class name for the data:
     {NewsArticleContent-module--articleTextContent--2yATc}
     */
    let article = $(".NewsArticleContent-module--articleTextContent--2yATc", content);


    //the line below is used to print the name of each character in a loop
    $("h3", article).each(function (i, elem) {

        /* 
            to get each game character table(s) we need to isolate the html between the names of the characters which
            they all use an h3 for that inside the article, so in each iteration of a character name we tell cheerio
            to continue from the current h3 (character name) until the next h3, because this is where the table(s) of 
            that character exists, we also used the optional second paramater of nextuntil to only extract the tables
            between them.
        */

        //print the character name
        console.log("------------------------- " + $(elem).text() + " -------------------------");
        // get html from this character name until the next one
        let tablesOfCharacter = $(elem, article).nextUntil("h3", "table");
        // iterate through the character table(s) and print there content
        $(tablesOfCharacter).each(function (i, elem) {
            console.log("table: " + i);
            console.log($(elem).text());
        });
    });

    await browser.close();
})();
