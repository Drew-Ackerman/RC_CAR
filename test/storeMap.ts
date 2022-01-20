import { AllPages } from "../src/pages";
import { AllPopups } from "../src/popups";
import { Browser, snapshot } from "../src/lib";
import { SupportedBrowsers } from "../config";

import chai = require("chai"); 
import chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

require("chromedriver");

/**
 * UI tests for the store map page.
 */
describe("The store map page", () => {  

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

	it("Allows stores to be filtered by zipcode", async () => {
		await pages.homePage.navigate();
		await pages.homePage.header.changeHomeStore();
		await popups.zipcodePopup.typeZipcode("84405");
		await popups.informationPopup.appearsAndLeaves();

		await pages.homePage.header.clickLocationButton();
		await pages.storeLocationsPage.clickAllStoresMapButton();
		
		const storeListBeforeSearch = (await pages.storeMapPage.getLocations()).map(async (location) => {
			return await location.getData();
		});
		await pages.storeMapPage.zipSearch("84405");
		
		const storeListAfterSearch = (await pages.storeMapPage.getLocations()).map(async (location) => {
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
