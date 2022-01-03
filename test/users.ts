import { AllPages, OrderThanksPage } from "../src/pages";
import { Browser, pageHasLoaded } from "../src/lib";
import { TestAddress, SupportedBrowsers, TestContactInfo, TestCreditCard } from "../config";
import { snapshot } from "../src/lib";
import { AccountTypes, ShippingOptions } from "../src/pages/CheckoutPage";

import chai = require("chai");
import chaiAsPromised = require("chai-as-promised");
import { GiftCardPage, GiftCardStyleSets } from "../src/pages/GiftCardPage";
chai.use(chaiAsPromised);
const expect = chai.expect;

require("chromedriver");

/**
 * A smoke test suite to ensure basic site functionality 
 * is operational.
 */
describe("Users", () => {  

	let browser: Browser;
	let pages: AllPages;
	/**
	 * Before all tests are run
	 */
	beforeEach(async () => {
		browser = await new Browser(SupportedBrowsers.Chrome);
		await browser.maximize();

		pages = new AllPages(browser);
	});

	it("Should be able to search for products", async() => {
		await pages.homePage.navigate();
		await pages.homePage.Search("");
		const productList = await pages.productSearchPage.findAllProductsOnPage();
		expect(productList).to.have.length.greaterThan(0);
	});

	it("Should be able to search for a product with tags", async() => {
		await pages.homePage.navigate();
		await pages.homePage.Search("Electronics");
		expect(pages.productSearchPage.MainPageTitle.getText()).to.eventually.contain("Electronics");
	});

	it("Should be able to set mutliple filters on a product search", async() => {
		await pages.homePage.navigate();
		await pages.homePage.Search("Gray Chair");
		const filters = await pages.productSearchPage.getActiveFilters();
		expect(filters).to.have.length.greaterThan(0);
	});

	it("Should be able to checkout a product as a guest", async () => {
		await pages.homePage.navigate();
		await pages.homePage.ClickShoppingCartButton();
		await pages.shoppingCartPage.header.searchForItem("");
		const productsList = await pages.productSearchPage.findAllProductsOnPage();
		expect(productsList).to.have.length.greaterThan(0);
		const firstProductCard = productsList[0];
		await pages.productSearchPage.selectProduct(firstProductCard);
		await pages.productPage.addToCart();
		await pages.shoppingCartPage.Checkout();
		await pages.checkoutPage.selectAccountType(AccountTypes.Guest);
		await pages.checkoutPage.selectDelivery(TestAddress, ShippingOptions.Any);
		await pages.checkoutPage.enterContactInfo(TestContactInfo);
		await pages.checkoutPage.enterPaymentDetails(TestCreditCard);
		await pages.checkoutPage.selectSameBillingAddress();
		await pages.checkoutPage.submitPaymentInformation();
		await pages.checkoutPage.placeOrder();
		return expect(pageHasLoaded(pages.orderThanksPage));
	});   

	it("Should be able to purchase a giftcard", async () => {
		await pages.homePage.navigate();
		await pages.homePage.ClickShoppingCartButton();
		await pages.shoppingCartPage.header.searchForItem("gift card");
		(await pages.productSearchPage.findAllProductsOnPage())[0].Click();
		const giftCardPage = new GiftCardPage(browser).isAvailable();
		(await giftCardPage).selectCardStyleSet(GiftCardStyleSets.Anytime);
		const cards = await (await giftCardPage).getCards(GiftCardStyleSets.Anytime);
		await cards[0].addToCart();
		await pages.shoppingCartPage.Checkout();
		await pages.checkoutPage.selectAccountType(AccountTypes.Guest);
		await pages.checkoutPage.enterGiftCardDeliveryOptions("demo@demo.com", "Demo Message");
		await pages.checkoutPage.enterContactInfo(TestContactInfo);
		await pages.checkoutPage.enterPaymentDetails(TestCreditCard);
		await pages.checkoutPage.enterBillingDetails(TestAddress);
		await pages.checkoutPage.submitPaymentInformation();
		await pages.checkoutPage.placeOrder();
		return expect(pageHasLoaded(pages.orderThanksPage));
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
