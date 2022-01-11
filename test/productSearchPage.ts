import { AllPages } from "../src/pages";
import { Browser, pageHasLoaded, urlContainsValue } from "../src/lib";
import { SupportedBrowsers } from "../config";
import { snapshot } from "../src/lib";

import chai = require("chai");
import chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

require("chromedriver");

/**
 * A smoke test suite to ensure basic site functionality 
 * is operational.
 */
describe("The product search page", () => {  

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

	it("should allow product filtering", async() => {
		await pages.homePage.navigate();
		await pages.homePage.Search("");
		await browser.wait(pageHasLoaded(pages.productSearchPage));
		const productList = await pages.productSearchPage.findAllProductsOnPage();
		await pages.productSearchPage.selectFilterOption("Furniture");
		await browser.wait(urlContainsValue(browser, "Furniture"));
		const productListAfterFilter = await pages.productSearchPage.findAllProductsOnPage();
		expect(productList).does.not.eql(productListAfterFilter);
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
