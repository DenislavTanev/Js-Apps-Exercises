const { chromium } = require('playwright-chromium');
const { expect } = require('chai');

let browser, page;

describe('E2E tests', function () {
    
    before(async () => {
        browser = await chromium.launch({headless: false, slowMo: 200});
    });
    after(async () => {
        await browser.close();
    })
    beforeEach(async () => {
        page = await browser.newPage();
    });
    afterEach(async () => {
        await page.close();
    });
    describe('Tests running', function () {
        it('loads static page', async () => {
            await page.goto('http://127.0.0.1:5500/01.Messenger');
            await page.click('text=Refresh');
            let content = await page.$eval('#messages', f => f.value);
            expect(content).to.equal('Spami: Hello, are you there?\nGarry: Yep, whats up :?\nSpami: How are you? Long time no see? :)\nGeorge: Hello, guys! :))\nSpami: Hello, George nice to see you! :)))');
        });

        it('sends a message', async () => {
            await page.goto('http://127.0.0.1:5500/01.Messenger');
            await page.fill('#author', 'asd');
            await page.fill('#content', 'ads');

            let [request] = await Promise.all([
                page.waitForRequest(r => r.url().includes('/jsonstore/messenger') && r.method() == 'POST'),
                page.click('#submit')
            ]);

            let data = JSON.parse(request.postData());
            expect(data.author == 'asd' && data.content == 'ads').to.be.true;
        })
    });
});

