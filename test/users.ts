import { HomePage, OrderThanksPage } from "../src/pages";
import { Browser } from "../src/lib";
import { config, SupportedBrowsers } from "../config";
import { snapshot } from "../src/lib/snapshot";
import { AccountTypes, ShippingOptions } from "../src/pages/CheckoutPage";
import { ZipcodePopup } from "../src/popups/ZipcodePopup";

import chai = require("chai");
import chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

require("chromedriver");

/**
 * A smoke test suite to ensure basic site functionality 
 * is operational.
 */
describe("Users", () => {  

	let browser: Browser;

	/**
	 * Before all tests are run
	 */
	beforeEach(async () => {
		browser = await new Browser(SupportedBrowsers.Chrome);
	});

	it("Should be able to search for products", async() => {
		const homePage = new HomePage(browser);
		homePage.navigate();
		const productPage = await homePage.Search("");
		const productList = await productPage.findAllProductsOnPage();
		expect(productList).to.have.length.greaterThan(0);
	});

	it("Should allow a product search on tags", async() => {
		const homePage = new HomePage(browser);
		homePage.navigate();
		const productPage = await homePage.Search("Electronics");
		expect(productPage.MainPageTitle.getText()).to.eventually.contain("Electronics");
	});

	it("Should set mutliple filters on a complex search", async() => {
		const homePage = new HomePage(browser);
		homePage.navigate();
		const productPage = await homePage.Search("Gray Chair");
		const filters = await productPage.getActiveFilters();
		expect(filters).to.have.length.greaterThan(0);
	});

	it("Should be able to checkout a product as a guest", async () => {
		const homePage = new HomePage(browser);
		await homePage.navigate();
		let shoppingCartPage = await homePage.ClickShoppingCartButton(); //Trip the zip code search to occur. 
		// const zipcodePopup = new ZipcodePopup(browser);
		// await zipcodePopup.waitTillVisible();
		// await zipcodePopup.typeZipcode(config.testAddress.zip);
		const productSearchPage = await shoppingCartPage.header.SearchForItem("in stock");
		const productsList = await productSearchPage.findAllProductsOnPage();
		expect(productsList).to.have.length.greaterThan(0);
		const firstProductCard = productsList[0];
		const productPage = await productSearchPage.selectProduct(firstProductCard);
		shoppingCartPage = await productPage.addToCart();
		const checkoutPage = await shoppingCartPage.Checkout();
		await checkoutPage.selectAccountType(AccountTypes.Guest);
		await checkoutPage.selectDelivery(ShippingOptions.FreeCurbside);
		await checkoutPage.enterContactInfo("demo@demo.com", "801-111-1111");
		await checkoutPage.enterPaymentDetails("4111111111111111", "06/30", "411");
		await checkoutPage.selectSameBillingAddress();
		await checkoutPage.submitPaymentInformation();
		await checkoutPage.placeOrder();
		const orderThanksPage = new OrderThanksPage(browser);
		return expect(browser.currentUrl()).to.eventually.contain("Order-Thanks");
	});   

	/**
	 * After all tests are run
	 */
	afterEach(async function () {

		//Check if the test that just ran was not successful
		if(this.currentTest?.state !== "passed"){
			snapshot(this,browser);
		}
		await browser.close();
	});
});
