import { HomePage } from "../src/pages";
import { Browser } from "../src/lib";
import { config, SupportedBrowsers, TestAddress, TestContactInfo } from "../config";
import { LoginPage } from "../src/pages/LoginPage";
import { snapshot } from "../src/lib/snapshot";

import chai = require("chai"); 
import chaiAsPromised = require("chai-as-promised");
import { MenuOptions } from "../src/pages/accountPages/AccountSideBar";
import { AccountHomePage, AccountSecurityPage } from "../src/pages/accountPages";
import { ZipcodePopup } from "../src/popups/ZipcodePopup";
import { AccountHelpPage } from "../src/pages/AccountHelpPage";
import { AccountCreationPage } from "../src/pages/AccountCreationPage";
import { ViewPersonalProfile } from "../src/pages/ViewPersonalProfile";
import { InformationPopup } from "../src/popups/InformationPopup";
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

    let homePage:HomePage;
    let zipCodePopup:ZipcodePopup;
    let loginPage:LoginPage;
    let accountHelpPage:AccountHelpPage;
    let accountCreationPage:AccountCreationPage;
    let viewPersonalProfilePage:ViewPersonalProfile
    let accountHomePage:AccountHomePage;
    let accountSecurityPage:AccountSecurityPage;
    let informationPopup: InformationPopup;

	/**
	 * Before all tests are run
	 */
	beforeEach(async () => {
        testEmail = createTestEmail(); //Create a new test email for each test. 

        //Create browser for each test
		browser = await new Browser(SupportedBrowsers.Chrome);

        homePage = new HomePage(browser);
        zipCodePopup = new ZipcodePopup(browser);
        loginPage = new LoginPage(browser);
        accountHelpPage = new AccountHelpPage(browser);
        accountCreationPage = new AccountCreationPage(browser);
        viewPersonalProfilePage = new ViewPersonalProfile(browser);
        accountHomePage = new AccountHomePage(browser);
        accountSecurityPage = new AccountSecurityPage(browser);
        informationPopup = new InformationPopup(browser);

        //Create a new user for each test. 
		await homePage.navigate();
        await homePage.header.changeHomeStore();
        await zipCodePopup.waitTillVisible();
        await zipCodePopup.typeZipcode("84405");

        //Create new account for each test.
		await homePage.GoToLoginPage() as LoginPage;
		await loginPage.setupNewAccount();
		await accountHelpPage.gotoAccountCreation();
		await accountCreationPage.CreateNewAccount(testEmail, password, "answer");
		await viewPersonalProfilePage.CompleteUserData(TestAddress,TestContactInfo);
		await browser.sleep(5);
        return expect(browser.currentUrl()).to.eventually.contain("account/Home");
	});

	it("Should allow customers to change their password", async() => {
        const newPassword = "Password2@";

		//const homePage = new HomePage(browser);
		//await homePage.navigate();
		//let loginPage = await homePage.GoToLoginPage() as LoginPage;
		//let accountHomePage = await loginPage.Login(testEmail, password);
        await accountHomePage.sidebar.selectMenuOption(MenuOptions.SecuritySettings);
        await browser.sleep(4);
        await accountSecurityPage.changePassword(password, newPassword);
        await browser.sleep(4);
        await accountHomePage.header.logout();

        await browser.sleep(4);
        await homePage.navigate();
        await homePage.GoToLoginPage() as LoginPage;
        await loginPage.Login(testEmail, newPassword);
        return expect(browser.currentUrl()).to.eventually.contain("account/Home");
	});

	it("Should allow customers to change their email", async() => {
        const newEmail = createTestEmail();

		//await homePage.navigate();
        await accountHomePage.sidebar.selectMenuOption(MenuOptions.SecuritySettings);
        await accountSecurityPage.changeEmail(newEmail);
        await browser.sleep(4);
        await accountHomePage.header.logout();
        await browser.sleep(4);

        await homePage.navigate();
        await homePage.GoToLoginPage() as LoginPage;
        await loginPage.Login(newEmail, password);
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
