import { AllPages } from "../src/pages";
import { AllPopups } from "../src/popups";
import { Browser, pageHasLoaded } from "../src/lib";
import { SupportedBrowsers, testData} from "../config";
import { snapshot } from "../src/lib";
import { PaymentMethods, ShippingOptions } from "../src/pages/CheckoutPage";

import chai = require("chai");
import chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

require("chromedriver");

/**
 * UI tests for the Account Activity Page. 
 */
describe("The Account Activity Page", function () {  
	this.timeout(180000); //Filtering a search can take a bit of time. 

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

	it("Should show recent purchases on an account", async () => {
		await pages.homePage.navigate();
		await pages.homePage.header.changeHomeStore();
		await popups.zipcodePopup.typeZipcode("84405");
		await popups.informationPopup.appearsAndLeaves();

		await pages.homePage.header.clickAccountButton();
		await pages.loginPage.login(testData.testEmployee.username, testData.testEmployee.password);
		await popups.informationPopup.appearsAndLeaves(); //Wait for a login dialog to disappear.
		await pages.accountHomePage.header.searchForItem("");
		await pages.productSearchPage.selectFilterOption("In Stock");
		await pages.productSearchPage.selectFilterOption("Sale");
		
		const productsList = await pages.productSearchPage.findAllProductsOnPage();
		const firstProductCard = productsList[0];
		const productDetails = await firstProductCard.getProductDetails();
		await pages.productSearchPage.selectProduct(firstProductCard);
		await pages.productPage.addToCart();
		await browser.wait(pageHasLoaded(pages.shoppingCartPage));
		await pages.shoppingCartPage.Checkout();
		await pages.checkoutPage.selectDelivery(testData.testAddress, ShippingOptions.Any);
		await pages.checkoutPage.enterContactInfo(testData.testContactInfo);
		await pages.checkoutPage.selectPaymentMethod(PaymentMethods.CreditCard);
		await pages.checkoutPage.enterPaymentDetails(testData.testCreditCard);
		await pages.checkoutPage.submitPaymentInformation();
		await pages.checkoutPage.placeOrder();
		await browser.wait(pageHasLoaded(pages.orderThanksPage));
		const orderNumber = await pages.orderThanksPage.getOrderNumber();

		await pages.homePage.navigate();
		await pages.homePage.header.selectAccountMenuOption("Account Activity");
		await browser.wait(pageHasLoaded(pages.accountActivityPage));
		
		const order = await pages.accountActivityPage.getOrder(orderNumber);
		expect(order?.containsItem(productDetails));
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
