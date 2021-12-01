import { HomePage } from "../src/pages";
import { Browser } from "../src/lib";
import { SupportedBrowsers } from "../config";
import { fail } from "assert";
import { snapshot } from "../src/lib/snapshot";

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var expect = chai.expect;

require("chromedriver");

/**
 * A smoke test suite to ensure basic site functionality 
 * is operational.
 */
describe('Users', () => {  

    let browser: Browser;

    /**
     * Before all tests are run
     */
    beforeEach(async () => {
        browser = await new Browser(SupportedBrowsers.Chrome);
    });

    it('Should be able to search for products', async() => {
        let homePage = new HomePage(browser);
        homePage.navigate();
        let productPage = await homePage.Search('');
        let productList = await productPage.findAllProductsOnPage();
        expect(productList).to.have.length.greaterThan(0);
    });

    it('Should allow a product search on tags', async() => {
        let homePage = new HomePage(browser);
        homePage.navigate();
        let productPage = await homePage.Search('Electronics');
        expect(productPage.MainPageTitle.getText()).to.eventually.contain('Electronics');
    });

    it('Should set mutliple filters on a complex search', async() => {
        let homePage = new HomePage(browser);
        homePage.navigate();
        let productPage = await homePage.Search('Gray Chair');
        let filters = await productPage.getActiveFilters();
        expect(filters).to.have.length.greaterThan(0);
    });

    it('Should allow a product to be checked out', async () => {
        let homePage = new HomePage(browser);
        homePage.navigate();
        let productSearchPage = await homePage.Search('');
        let productsList = await productSearchPage.findAllProductsOnPage();
        expect(productsList).to.have.length.greaterThan(0);
        let firstProductCard = productsList[0];
        let firstProductDetails = await firstProductCard.getProductDetails();
        let productPage = await productSearchPage.selectProduct(firstProductCard);
        expect(await productPage.hasTheProduct(firstProductDetails));
        fail("Test incomplete");
    });

    /**
     * After all tests are run
     */
    afterEach(async function () {

        //Check if the test that just ran was not successful
        if(this.currentTest?.state !== 'passed'){
            snapshot(this,browser);
        }
        await browser.close();
    });
});
