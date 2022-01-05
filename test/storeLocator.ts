import { AllPages } from "../src/pages";
import { Browser } from "../src/lib";
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
describe("The store locator page", () => {  

	let browser: Browser;
	let pages: AllPages;

	/**
	 * Before all tests are run
	 */
	beforeEach(async () => {
		browser = await new Browser(SupportedBrowsers.Chrome);
		pages = new AllPages(browser);
	});

	it("Displays available store locations", async () => {
		await pages.homePage.navigate();
		await pages.homePage.header.clickLocationButton();
		expect(pages.storeLocationsPage.getStoreLocations()).to.eventually.be.greaterThan(0);
	});

	/** 
	 * After all tests are run
	 */
	afterEach(async function () {

		//Check if the test that just ran was not successful
		if(this.currentTest?.state !== "passed"){
			snapshot(this, browser);
		}
		await browser.close();
	});
});
