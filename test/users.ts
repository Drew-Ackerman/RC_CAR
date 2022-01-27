import { AllPages } from "../src/pages";
import { Browser, pageHasLoaded } from "../src/lib";
import { SupportedBrowsers, testData } from "../config";
import { snapshot } from "../src/lib";
import { AccountTypes, ShippingOptions } from "../src/pages/CheckoutPage";
import { GiftCardStyleSets } from "../src/pages/GiftCardPage";

import chai = require("chai");
import chaiAsPromised = require("chai-as-promised");
import { AllPopups } from "../src/popups";
chai.use(chaiAsPromised);
const expect = chai.expect;

require("chromedriver");

/**
 * A smoke test suite to ensure basic site functionality 
 * is operational.
 */
describe("Users", function () {  
	//Change timeout to longer because this some tests here takes a bit longer
	this.timeout(180000);

	let browser: Browser;
	let pages: AllPages;
	let popups: AllPopups;

	/**
	 * Before all tests are run
	 */
	beforeEach(async () => {
		browser = await new Browser(SupportedBrowsers.Chrome);
		await browser.maximize();

		pages = new AllPages(browser);
		popups = new AllPopups(browser);
	});  

	it("Should be able to search for products", async() => {
		await pages.homePage.navigate();
		await pages.homePage.header.searchForItem("");
		const productList = await pages.productSearchPage.findAllProductsOnPage();
		expect(productList).to.have.length.greaterThan(0);
	});

	it("Should be able to search for a product with tags", async() => {
		await pages.homePage.navigate();
		await pages.homePage.header.searchForItem("Electronics");
		expect(pages.productSearchPage.mainPageTitle.getText()).to.eventually.contain("Electronics");
	});

	it("Should be able to set mutliple filters on a product search", async() => {
		await pages.homePage.navigate();
		await pages.homePage.header.searchForItem("Gray Chair");
		const filters = await pages.productSearchPage.getActiveFilters();
		expect(filters).to.have.length.greaterThan(0);
	});

	it("Should be able to checkout a product as a guest", async () => {
		await pages.homePage.navigate();
		await pages.homePage.header.changeHomeStore();
		await popups.zipcodePopup.typeZipcode("84405");
		await popups.informationPopup.appearsAndLeaves();
		
		await pages.shoppingCartPage.header.searchForItem("");
		await pages.productSearchPage.selectFilterOption("In Stock");
		await pages.productSearchPage.selectFilterOption("Sale");

		const productsList = await pages.productSearchPage.findAllProductsOnPage();
		expect(productsList).to.have.length.greaterThan(0);
		const firstProductCard = productsList[0];
		await pages.productSearchPage.selectProduct(firstProductCard);
		await pages.productPage.addToCart();
		await browser.wait(pageHasLoaded(pages.shoppingCartPage));
		await pages.shoppingCartPage.checkout();
		await pages.checkoutPage.accountSection.continueAsGuest();
		await pages.checkoutPage.shippingSection.selectDelivery(testData.testAddress, ShippingOptions.Any);
		await pages.checkoutPage.contactInfoSection.enterContactInfo(testData.testContactInfo);
		await pages.checkoutPage.paymentSection.enterPaymentDetails(testData.testCreditCard);
		await pages.checkoutPage.paymentSection.selectSameBillingAddress();
		await pages.checkoutPage.paymentSection.submitPaymentInformation();
		await pages.checkoutPage.orderReviewSection.placeOrder();
		return expect(pageHasLoaded(pages.orderThanksPage));
	});   

	it("Should be able to purchase a giftcard", async () => {
		await pages.homePage.navigate();
		await pages.homePage.header.changeHomeStore();
		await popups.zipcodePopup.typeZipcode("84405");
		await popups.informationPopup.appearsAndLeaves();

		await pages.shoppingCartPage.header.searchForItem("gift card");
		(await pages.productSearchPage.findAllProductsOnPage())[0].click();
		await browser.wait(pageHasLoaded(pages.giftcardPage));
		await pages.giftcardPage.selectCardStyleSet(GiftCardStyleSets.Anytime);
		const cards = await pages.giftcardPage.getCards(GiftCardStyleSets.Anytime);
		await cards[0].addToCart();
		await pages.shoppingCartPage.checkout();
		await pages.checkoutPage.accountSection.continueAsGuest();
		await pages.checkoutPage.shippingSection.enterGiftCardDeliveryOptions("demo@demo.com", "Demo Message");
		await pages.checkoutPage.contactInfoSection.enterContactInfo(testData.testContactInfo);
		await pages.checkoutPage.paymentSection.enterPaymentDetails(testData.testCreditCard);
		await pages.checkoutPage.paymentSection.enterBillingDetails(testData.testAddress);
		await pages.checkoutPage.paymentSection.submitPaymentInformation();
		await pages.checkoutPage.orderReviewSection.placeOrder();
		return expect(pageHasLoaded(pages.orderThanksPage));
	});

	it("Should be able to checkout a local and drop shipped product", async () => {
		await pages.homePage.navigate();
		await pages.homePage.header.changeHomeStore();
		await popups.zipcodePopup.typeZipcode("84405");
		await popups.informationPopup.appearsAndLeaves();
		
		//Grab the first item.
		await pages.homePage.header.searchForItem("");
		await pages.productSearchPage.selectFilterOption("In Stock");
		await pages.productSearchPage.selectFilterOption("Sale");

		let productsList = await pages.productSearchPage.findAllProductsOnPage();
		const firstProduct = productsList[0];
		await pages.productSearchPage.selectProduct(firstProduct);
		await pages.productPage.addToCart();
		await browser.wait(pageHasLoaded(pages.shoppingCartPage));

		await pages.shoppingCartPage.header.searchForItem("");
		await pages.productSearchPage.selectFilterOption("Direct From Manufacturer");
		productsList = await pages.productSearchPage.findAllProductsOnPage();
		const secondProduct = productsList[0];
		await pages.productSearchPage.selectProduct(secondProduct);
		await pages.productPage.addToCart();
		await browser.wait(pageHasLoaded(pages.shoppingCartPage));

		await pages.shoppingCartPage.checkout();
		await pages.checkoutPage.accountSection.continueAsGuest();
		await pages.checkoutPage.shippingSection.selectDelivery(testData.testAddress, ShippingOptions.Any);
		await pages.checkoutPage.contactInfoSection.enterContactInfo(testData.testContactInfo);
		await pages.checkoutPage.paymentSection.enterPaymentDetails(testData.testCreditCard);
		await pages.checkoutPage.paymentSection.selectSameBillingAddress();
		await pages.checkoutPage.paymentSection.submitPaymentInformation();
		await pages.checkoutPage.orderReviewSection.placeOrder();
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
