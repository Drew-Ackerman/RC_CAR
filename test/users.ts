import { HomePage } from "../src/pages";
import { Browser, getRandomInt } from "../src/lib";
import { SupportedBrowsers } from "../config";
import { LoginPage } from "../src/pages/LoginPage";
import { fail } from "assert";

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var expect = chai.expect;

require("chromedriver");

function createDemoEmail(){
    return `demo${getRandomInt()}@rcwilley.com`;
}

/**
 * A smoke test suite to ensure basic site functionality 
 * is operational.
 */
describe('Users', () => {  

    let browser: Browser;
    const demoEmail: string = createDemoEmail();
    const password: string = 'Password1!';

    /**
     * Before all tests are run
     */
    beforeEach(async () => {
        browser = await new Browser(SupportedBrowsers.Chrome);
    });

    it('Should be able to create an account', async() => {
        let homePage = new HomePage(browser);
        homePage.navigate();
        let loginPage = await homePage.GoToLoginPage() as LoginPage;
        let accountHelpPage = await loginPage.setupNewAccount();
        let accountCreationPage = await accountHelpPage.gotoAccountCreation();
        let viewPersonalProfilePage = await accountCreationPage.CreateNewAccount(demoEmail, password, 'answer');
        await viewPersonalProfilePage.CompleteUserData('Demo', 'Demo', '1111111111', 'DemoStreet', 'DemoTown', 'UT', '84405');
        return expect(browser.currentUrl()).to.eventually.contain('account/Home');
    });

    it('Should be able to login from the home page', async() => {
        let homePage = new HomePage(browser);
        await homePage.navigate();
        let loginPage = await homePage.GoToLoginPage() as LoginPage;
        await loginPage.Login(demoEmail, password);
        return expect(browser.currentUrl()).to.eventually.contain('account/Home');

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
    afterEach(async () => {
        await browser.close();
    });
});
