import { AllPages } from "../src/pages";
import { AllPopups } from "../src/popups";
import { Browser, pageHasLoaded, snapshot } from "../src/lib";
import { SupportedBrowsers, testData, waitFor} from "../config";

import chai = require("chai"); 
import chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

require("chromedriver");

/**
 * Collision will occur if multiple calls are made within one second due
 * to conversion of the time to seconds. 
 * @returns A generated email address to use. 
 */
function createDemoEmail(){
	return `demo${Math.floor(Date.now()/1000)}@rcwilley.com`;
}

/**
 * A smoke test suite to ensure basic site functionality 
 * is operational.
 */
describe("The login page", () => {  

	let browser: Browser;
	const demoEmail: string = createDemoEmail();
	const password = "Password1!";

	let pages:AllPages;
	let popups:AllPopups;

	/**
	 * Before all tests are run
	 */
	beforeEach(async () => {
		browser = await new Browser(SupportedBrowsers.Chrome);
		await browser.maximize();

		pages = new AllPages(browser);
		popups = new AllPopups(browser);

		await pages.homePage.navigate();
		await pages.homePage.header.changeHomeStore();
		await popups.zipcodePopup.typeZipcode("84405");
		await popups.informationPopup.appearsAndLeaves();
	});

	it("Should allow an account to be created", async() => {
		await pages.homePage.header.clickAccountButton();
		await pages.loginPage.setupNewAccount();
		await pages.accountHelpPage.CreateAccountLink.click();
		await pages.accountCreationPage.createNewAccount(demoEmail, password, "demo");
		await browser.wait(pageHasLoaded(pages.viewPersonalProfilePage), waitFor.TenSeconds);
		await pages.viewPersonalProfilePage.completeUserData(testData.testAddress, testData.testContactInfo);
		await browser.wait(pageHasLoaded(pages.accountHomePage), waitFor.TenSeconds);
		return expect(browser.currentUrl()).to.eventually.contain("account/Home");
	});

	it("Should allow customers to login", async() => {
		await pages.homePage.GoToLoginPage();
		await pages.loginPage.login(demoEmail, password);
		return expect(browser.currentUrl()).to.eventually.contain("account/Home");
	});

	it("Should allow employees to login", async() => {
		await pages.homePage.GoToLoginPage();
		await pages.loginPage.login(`${testData.testEmployee.username}`, `${testData.testEmployee.password}`);
		return expect(browser.currentUrl()).to.eventually.contain("account/Home");
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