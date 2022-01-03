import { AllPages } from "../src/pages";
import { Browser } from "../src/lib";
import { SupportedBrowsers, TestAddress, TestContactInfo } from "../config";
import { snapshot } from "../src/lib";

import chai = require("chai"); 
import chaiAsPromised = require("chai-as-promised");
import { ZipcodePopup } from "../src/popups/ZipcodePopup";
import { MenuOptions } from "../src/components/AccountSideBar";
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

	/**
	 * Before all tests are run
	 */
	beforeEach(async () => {
		testEmail = createTestEmail(); //Create a new test email for each test. 

		//Create browser for each test
		browser = await new Browser(SupportedBrowsers.Chrome);
		pages = new AllPages(browser);
		const zipCodePopup = new ZipcodePopup(browser);

		//Create a new user for each test. 
		await pages.homePage.navigate();
		await pages.homePage.header.changeHomeStore();
		await zipCodePopup.waitTillVisible();
		await zipCodePopup.typeZipcode("84405");

		//Create new account for each test.
		await pages.homePage.GoToLoginPage();
		await pages.loginPage.setupNewAccount();
		await pages.accountHelpPage.gotoAccountCreation();
		await pages.accountCreationPage.CreateNewAccount(testEmail, password, "answer");
		await pages.viewPersonalProfilePage.CompleteUserData(TestAddress,TestContactInfo);
		await browser.sleep(5);
		return expect(browser.currentUrl()).to.eventually.contain("account/Home");
	});

	it("Should allow customers to change their password", async() => {
		const newPassword = "Password2@";

		//const homePage = new HomePage(browser);
		//await homePage.navigate();
		//let loginPage = await homePage.GoToLoginPage() as LoginPage;
		//let accountHomePage = await loginPage.Login(testEmail, password);
		await pages.accountHomePage.sidebar.selectMenuOption(MenuOptions.SecuritySettings);
		await browser.sleep(4);
		await pages.accountSecurityPage.changePassword(password, newPassword);
		await browser.sleep(4);
		await pages.accountHomePage.header.logout();

		await browser.sleep(4);
		await pages.homePage.navigate();
		await pages.homePage.GoToLoginPage();
		await pages.loginPage.Login(testEmail, newPassword);
		return expect(browser.currentUrl()).to.eventually.contain("account/Home");
	});

	it("Should allow customers to change their email", async() => {
		const newEmail = createTestEmail();

		//await homePage.navigate();
		await pages.accountHomePage.sidebar.selectMenuOption(MenuOptions.SecuritySettings);
		await pages.accountSecurityPage.changeEmail(newEmail);
		await browser.sleep(4);
		await pages.accountHomePage.header.logout();
		await browser.sleep(4);

		await pages.homePage.navigate();
		await pages.homePage.GoToLoginPage();
		await pages.loginPage.Login(newEmail, password);
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
