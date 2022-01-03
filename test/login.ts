import { AllPages } from "../src/pages";
import { Browser, pageHasLoaded, snapshot } from "../src/lib";
import { config, SupportedBrowsers, TestAddress, TestContactInfo } from "../config";

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

	/**
	 * Before all tests are run
	 */
	beforeEach(async () => {
		browser = await new Browser(SupportedBrowsers.Chrome);
		pages = new AllPages(browser);
	});

	it("Should allow an account to be created", async() => {
		await pages.homePage.navigate();
		await pages.homePage.header.clickAccountButton();
		await pages.loginPage.SetupNewAccountBtn.click();
		await pages.accountHelpPage.CreateAccountLink.click();
		await pages.accountCreationPage.CreateNewAccount(demoEmail, password, "demo");
		await browser.wait(pageHasLoaded(pages.viewPersonalProfilePage));
		await pages.viewPersonalProfilePage.CompleteUserData(TestAddress, TestContactInfo);
		await browser.wait(pageHasLoaded(pages.accountHomePage), 10000);
		return expect(browser.currentUrl()).to.eventually.contain("account/Home");
	});

	it("Should allow customers to login", async() => {
		await pages.homePage.navigate();
		await pages.homePage.GoToLoginPage();
		await pages.loginPage.Login(demoEmail, password);
		return expect(browser.currentUrl()).to.eventually.contain("account/Home");
	});

	it("Should allow employees to login", async() => {
		await pages.homePage.navigate();
		await pages.loginPage.Login(`${config.testEmployee.username}`, `${config.testEmployee.password}`);
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
