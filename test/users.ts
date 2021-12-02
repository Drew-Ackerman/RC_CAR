import { HomePage, OrderThanksPage } from "../src/pages";
import { Browser } from "../src/lib";
import { config, SupportedBrowsers } from "../config";
import { snapshot } from "../src/lib/snapshot";
import { AccountTypes, ShippingOptions } from "../src/pages/CheckoutPage";
import { ZipcodePopup } from "../src/popups/ZipcodePopup";

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

    it('Should be able to checkout a product as a guest', async () => {
        let homePage = new HomePage(browser);
        await homePage.navigate();
        let shoppingCartPage = await homePage.ClickShoppingCartButton(); //Trip the zip code search to occur. 
        let zipcodePopup = new ZipcodePopup(browser);
        await zipcodePopup.waitTillVisible();
        await zipcodePopup.typeZipcode(config.testAddress.zip);
        let productSearchPage = await shoppingCartPage.header.SearchForItem('in stock');
        let productsList = await productSearchPage.findAllProductsOnPage();
        expect(productsList).to.have.length.greaterThan(0);
        let firstProductCard = productsList[0];
        let productPage = await productSearchPage.selectProduct(firstProductCard);
        shoppingCartPage = await productPage.addToCart();
        let checkoutPage = await shoppingCartPage.Checkout();
        await checkoutPage.selectAccountType(AccountTypes.Guest);
        await checkoutPage.selectDelivery(ShippingOptions.FreeCurbside);
        await checkoutPage.enterContactInfo('demo@demo.com', '801-111-1111');
        await checkoutPage.enterPaymentDetails('4111111111111111', '06/30', '411');
        await checkoutPage.selectSameBillingAddress();
        await checkoutPage.submitPaymentInformation();
        await checkoutPage.placeOrder();
        let orderThanksPage = new OrderThanksPage(browser);
        return expect(browser.currentUrl()).to.eventually.contain('Order-Thanks');
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
