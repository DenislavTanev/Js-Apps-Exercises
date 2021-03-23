let chromium = require('playwright-chromium').chromium;
let expect = require('chai').expect;
let mockdata = require('./mockdata.json');

let browser, page;

describe('E2E tests', function () {
    this.timeout(600000);
    before(async () => {
        browser = await chromium.launch({ headless: false, slowMo: 500 });
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
        it('loads all books', async () => {
            await page.goto('http://127.0.0.1:5500/02.Book-Library/index.html');
            await page.route('**/jsonstore/collections/books*', request => request.fulfill(json(mockdata.books)));
            await page.click('#loadBooks');
            let content = await page.$$eval('tbody>tr>td', r => r.map(c => c.textContent));
            expect(
                content.includes('J.K.Rowling') &&
                content.includes('Harry Potter and the Philosopher\'s Stone') &&
                content.includes('Svetlin Nakov') &&
                content.includes('C# Fundamentals'))
                .to.be.true;
        });
        it('adds books', async () => {
            await page.goto('http://127.0.0.1:5500/02.Book-Library/index.html');
            await page.fill('#createForm input[name="title"]', 'abcd');
            await page.fill('#createForm input[name="author"]', 'efgh');

            let [request] = await Promise.all([
                page.waitForRequest(r => r.url().includes('/jsonstore/collections/books') && r.method() == 'POST'),
                page.click('#createForm button')
            ]);

            let data = JSON.parse(request.postData());
            expect(data.title == 'abcd' && data.author == 'efgh');
        });
        it('edits books', async () => {
            await page.route('**/jsonstore/collections/books*', request => request.fulfill(json(mockdata.books)));
            await page.goto('http://127.0.0.1:5500/02.Book-Library/index.html');
            await page.click('#loadBooks');
            await page.click('button.editBtn:nth-child(1)');
            await page.fill('#editForm input[name="title"]', 'abcd');
            await page.fill('#editForm input[name="author"]', 'efgh');

            let [request] = await Promise.all([
                page.waitForRequest(r => r.url().includes('/jsonstore/collections/books') && r.method() == 'PUT'),
                page.click('#editForm>button')
            ]);

            let data = JSON.parse(request.postData());
            expect(data.title == 'abcd' && data.author == 'efgh');
        });
        it('deletes books', async () => {
            await page.route('**/jsonstore/collections/books*', request => request.fulfill(json(mockdata.books)));
            await page.goto('http://127.0.0.1:5500/02.Book-Library/');
            await page.click('#loadBooks');
            await page.click('button.deleteBtn:nth-child(2)');
            page.on('dialog', async dialog => {
                await dialog.accept();
                let request = await page.waitForRequest(request => request.url().includes('/jsonstore/collections/books') && request.method() == 'DELETE');
                let postData = JSON.parse(request.postData());
                expect(postData.title).to.equal(title);
                expect(postData.author).to.equal(author);
            });
        });
    });
});

function json(data) {
    return {
        status: 200,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-type': 'application/json' },
        body: JSON.stringify(data)
    };
}