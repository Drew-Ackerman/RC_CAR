import { HomePage, OrderThanksPage, GiftCardStyleSets } from "../src/pages";
import { Browser, pageHasLoaded } from "../src/lib";
import { DemoAddress, SupportedBrowsers } from "../config";
import { snapshot } from "../src/lib/snapshot";
import { AccountTypes, ShippingOptions } from "../src/pages/CheckoutPage";

import chai = require("chai");
import chaiAsPromised = require("chai-as-promised");
import { GiftCardPage } from "../src/pages/GiftCardPage";
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
		await browser.maximize();
	});

	it("Should be able to search for products", async() => {
		const homePage = new HomePage(browser);
		homePage.navigate();
		const productPage = await homePage.Search("");
		const productList = await productPage.findAllProductsOnPage();
		expect(productList).to.have.length.greaterThan(0);
	});

	it("Should be able to search for a product with tags", async() => {
		const homePage = new HomePage(browser);
		homePage.navigate();
		const productPage = await homePage.Search("Electronics");
		expect(productPage.MainPageTitle.getText()).to.eventually.contain("Electronics");
	});

	it("Should be able to set mutliple filters on a product search", async() => {
		const homePage = new HomePage(browser);
		homePage.navigate();
		const productPage = await homePage.Search("Gray Chair");
		const filters = await productPage.getActiveFilters();
		expect(filters).to.have.length.greaterThan(0);
	});

	it("Should be able to checkout a product as a guest", async () => {
		const homePage = new HomePage(browser);
		await homePage.navigate();
		let shoppingCartPage = await homePage.ClickShoppingCartButton();
		const productSearchPage = await shoppingCartPage.header.searchForItem("");
		const productsList = await productSearchPage.findAllProductsOnPage();
		expect(productsList).to.have.length.greaterThan(0);
		const firstProductCard = productsList[0];
		const productPage = await productSearchPage.selectProduct(firstProductCard);
		shoppingCartPage = await productPage.addToCart();
		const checkoutPage = await shoppingCartPage.Checkout();
		await checkoutPage.selectAccountType(AccountTypes.Guest);
		await checkoutPage.selectDelivery(DemoAddress, ShippingOptions.Any);
		await checkoutPage.enterContactInfo("demo@demo.com", "801-111-1111");
		await checkoutPage.enterPaymentDetails("4111111111111111", "06/30", "411");
		await checkoutPage.selectSameBillingAddress();
		await checkoutPage.submitPaymentInformation();
		await checkoutPage.placeOrder();
		const orderThanksPage = new OrderThanksPage(browser);
		return expect(browser.currentUrl()).to.eventually.contain("Order-Thanks");
	});   

	it("Should be able to purchase a giftcard", async () => {
		const homePage = new HomePage(browser);
		await homePage.navigate();
		let shoppingCartPage = await homePage.ClickShoppingCartButton();
		const productSearchPage = await shoppingCartPage.header.searchForItem("gift card");
		(await productSearchPage.findAllProductsOnPage())[0].Click();
		const giftCardPage = new GiftCardPage(browser).isAvailable();
		(await giftCardPage).selectCardStyleSet(GiftCardStyleSets.Anytime);
		const cards = await (await giftCardPage).getCards(GiftCardStyleSets.Anytime);
		shoppingCartPage = await cards[0].addToCart();
		const checkoutPage = await shoppingCartPage.Checkout();
		await checkoutPage.selectAccountType(AccountTypes.Guest);
		await checkoutPage.enterGiftCardDeliveryOptions("demo@demo.com", "Demo Message");
		await checkoutPage.enterContactInfo("demo@demo.com", "801-111-1111");
		await checkoutPage.enterPaymentDetails("4111111111111111", "06/30", "411");
		await checkoutPage.enterBillingDetails(DemoAddress);
		await checkoutPage.submitPaymentInformation();
		await checkoutPage.placeOrder();
		const orderThanksPage = new OrderThanksPage(browser);
		return expect(pageHasLoaded(OrderThanksPage));
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
