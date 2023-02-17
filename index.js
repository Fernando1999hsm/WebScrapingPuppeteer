const puppeteer = require('puppeteer');

(async() =>{
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    await page.goto('https://www.amazon.com.mx/');
    await page.screenshot({path:'amazon1.jpg'});

    await page.type('#twotabsearchtextbox','la peor señora del mundo libro');
    await page.screenshot({path:'amazon2.jpg'});

    await page.click('#nav-search-submit-button');
    await page.waitForSelector('[data-component-type=s-search-result]');
    await page.screenshot({path:'amazon3.jpg'});
    
    const grabInfo = await page.evaluate(() => {
        const elements = document.querySelectorAll('[data-component-type=s-search-result] h2 a');

        const links = [];
        for(let element of elements){
            links.push(element.href);
        }
        return links;
    });
    console.log(grabInfo.length);
    const books=[];
    for(let grabInfos of grabInfo){
        await page.goto(grabInfos);
        await page.waitForSelector('#productTitle');
        const book = await page.evaluate(()=>{
            const tmp = {};
            tmp.title = document.querySelector('#productTitle').innerHTML;
            tmp.autor = document.querySelector('.autor a').innerHTML;
            return tmp;
        })
        books.push(book)
    }
    console.log(books);
    await browser.close();
})();