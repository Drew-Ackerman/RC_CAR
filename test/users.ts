import { HomePage, OrderThanksPage } from "../src/pages";
import { Browser, elementIsPresent, elementIsVisible, TextInput, urlContainsValue } from "../src/lib";
import { SupportedBrowsers } from "../config";
import { snapshot } from "../src/lib/snapshot";
import { AccountTypes, ShippingOptions } from "../src/pages/CheckoutPage";
import { Key } from "selenium-webdriver";
import { elementIsDisabled, urlContains } from "selenium-webdriver/lib/until";

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
        let zipInput = new TextInput(browser.findElement({css:"input[name='zipCode']"}), "input[name='zipCode']"); 
        await browser.wait(elementIsPresent(()=>zipInput));
        await zipInput.type('84405');
        await zipInput.type(Key.ENTER);
        let productSearchPage = await shoppingCartPage.header.SearchForItem('');
        let productsList = await productSearchPage.findAllProductsOnPage();
        expect(productsList).to.have.length.greaterThan(0);
        let firstProductCard = productsList[0];
        let firstProductDetails = await firstProductCard.getProductDetails();
        let productPage = await productSearchPage.selectProduct(firstProductCard);
        expect(await productPage.hasTheProduct(firstProductDetails));
        shoppingCartPage = await productPage.addToCart();
        let checkoutPage = await shoppingCartPage.Checkout();
        await checkoutPage.selectAccountType(AccountTypes.Guest);
        await checkoutPage.selectDelivery(ShippingOptions.FreeCurbside);
        await checkoutPage.enterContactInfo('demo@demo.com', '801-111-1111');
        await checkoutPage.enterPaymentDetails('4111111111111111', '06/30', '411');
        await checkoutPage.selectSameBillingAddress();
        await checkoutPage.ContinuePaymentButton.click();
        await checkoutPage.PlaceOrderButton.click();  
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
