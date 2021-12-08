import { HomePage } from "../src/pages";
import { Browser } from "../src/lib";
import { SupportedBrowsers } from "../config";
import { snapshot } from "../src/lib/snapshot";

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

	/**
	 * Before all tests are run
	 */
	beforeEach(async () => {
		browser = await new Browser(SupportedBrowsers.Chrome);
		browser.addCookie({name:"SiteSessionId", value:"34632632462346"});
	});

	it("Displays available store locations", async () => {
		const homePage = new HomePage(browser);
		homePage.navigate();
		const storeLocationsPage = await homePage.header.clickLocationButton();
		expect(storeLocationsPage.getStoreLocations()).to.eventually.be.greaterThan(0);
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
