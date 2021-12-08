import { HomePage } from "../src/pages";
import { Browser } from "../src/lib";
import { SupportedBrowsers } from "../config";
import { snapshot } from "../src/lib/snapshot";

import chai = require("chai"); 
import chaiAsPromised = require("chai-as-promised");
import { ZipcodePopup } from "../src/popups/ZipcodePopup";
chai.use(chaiAsPromised);
const expect = chai.expect;

require("chromedriver");

/**
 * A smoke test suite to ensure basic site functionality 
 * is operational.
 */
describe("The store map page", () => {  

	let browser: Browser;

	/**
	 * Before all tests are run
	 */
	beforeEach(async () => {
		browser = await new Browser(SupportedBrowsers.Chrome);
		browser.addCookie({name:"SiteSessionId", value:"34632632462346"});
	});

	it("Allows stores to be filtered by zipcode", async () => {
		const homePage = new HomePage(browser);
		await homePage.navigate();
		await homePage.header.changeHomeStore();
		const zipcodePopup = new ZipcodePopup(browser);
		await zipcodePopup.waitTillVisible();
		await zipcodePopup.typeZipcode("84405");
		const storeLocationsPage = await homePage.header.clickLocationButton();
		const storeMapPage = await storeLocationsPage.clickAllStoresMapButton();
		const storeListBeforeSearch = (await storeMapPage.getLocations()).map(async (location) => {
			return await location.getData();
		});
		storeMapPage.zipSearch("84405");
		const storeListAfterSearch = (await storeMapPage.getLocations()).map(async (location) => {
			return await location.getData();
		});
		expect(storeListBeforeSearch).to.not.equal(storeListAfterSearch);
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
