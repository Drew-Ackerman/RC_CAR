import { AllPages } from "../src/pages";
import { AllPopups } from "../src/popups";
import { Browser, pageHasLoaded } from "../src/lib";
import { SupportedBrowsers, testData, waitFor } from "../config";
import { snapshot } from "../src/lib";
import { MenuOptions } from "../src/partials/AccountSideBar";

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
function createTestEmail(){
	return `demo${Math.floor(Date.now()/1000)}@rcwilley.com`;
}

/**
 * A smoke test suite to ensure basic site functionality 
 * is operational.
 */
describe("The Security Settings Page", () => {  

	let browser: Browser;
	let testEmail: string; 
	const password = "Password1!";

	let pages:AllPages;
	let popups:AllPopups;

	/**
	 * Before all tests are run
	 */
	beforeEach(async () => {
		testEmail = createTestEmail(); //Create a new test email for each test. 

		//Create browser for each test
		browser = await new Browser(SupportedBrowsers.Chrome);
		await browser.maximize();

		pages = new AllPages(browser);
		popups = new AllPopups(browser);

		//Create a new user for each test. 
		await pages.homePage.navigate();
		await pages.homePage.header.changeHomeStore();
		await popups.zipcodePopup.typeZipcode("84405");
		await popups.informationPopup.appearsAndLeaves(waitFor.TenSeconds);

		//Create new account for each test.
		await pages.homePage.goToLoginPage();
		await pages.loginPage.setupNewAccount();
		await pages.accountHelpPage.gotoAccountCreation();
		await pages.accountCreationPage.createNewAccount(testEmail, password, "answer");
		await browser.wait(pageHasLoaded(pages.viewPersonalProfilePage), waitFor.TenSeconds);
		await pages.viewPersonalProfilePage.completeUserData(testData.testAddress, testData.testContactInfo);
		await popups.informationPopup.appearsAndLeaves(waitFor.TenSeconds);

		//Starting point for tests is a logged in account on the account home page.
		await browser.wait(pageHasLoaded(pages.accountHomePage), waitFor.TenSeconds);		
	});

	it("Should allow customers to change their password", async() => {
		const newPassword = "Password2@";

		await pages.accountHomePage.sidebar.selectMenuOption(MenuOptions.SecuritySettings);
		await browser.wait(pageHasLoaded(pages.accountSecurityPage), 10);
		await pages.accountSecurityPage.changePassword(newPassword);
		await popups.informationPopup.appearsAndLeaves(waitFor.TenSeconds);
		await pages.accountHomePage.header.logout();

		await browser.wait(pageHasLoaded(pages.homePage));
		await popups.informationPopup.displaysAndLeaves("logged out", waitFor.TenSeconds);

		await pages.homePage.navigate();
		await pages.homePage.goToLoginPage();
		await pages.loginPage.login(testEmail, newPassword);
		return expect(browser.currentUrl()).to.eventually.contain("account/Home");
	});

	it("Should allow customers to change their email", async() => {
		const newEmail = createTestEmail();

		await pages.accountHomePage.sidebar.selectMenuOption(MenuOptions.SecuritySettings);
		await pages.accountSecurityPage.changeEmail(newEmail);
		await popups.informationPopup.appearsAndLeaves(waitFor.TenSeconds);
		await pages.accountHomePage.header.logout();

		await browser.wait(pageHasLoaded(pages.homePage));
		await popups.informationPopup.displaysAndLeaves("logged out", waitFor.TenSeconds);

		await pages.homePage.navigate();
		await pages.homePage.goToLoginPage();
		await pages.loginPage.login(newEmail, password);
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
