import { HomePage } from "../src/pages";
import { Browser } from "../src/lib";
import { config, SupportedBrowsers } from "../config";
import { LoginPage } from "../src/pages/LoginPage";
import { snapshot } from "../src/lib/snapshot";

const chai = require("chai"); 
const chaiAsPromised = require("chai-as-promised");
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

	/**
	 * Before all tests are run
	 */
	beforeEach(async () => {
		browser = await new Browser(SupportedBrowsers.Chrome);
		browser.addCookie({name:"SiteSessionId", value:"34632632462346"});
	});

	it("Should allow an account to be created", async() => {
		const homePage = new HomePage(browser);
		homePage.navigate();
		const loginPage = await homePage.GoToLoginPage() as LoginPage;
		const accountHelpPage = await loginPage.setupNewAccount();
		const accountCreationPage = await accountHelpPage.gotoAccountCreation();
		const viewPersonalProfilePage = await accountCreationPage.CreateNewAccount(demoEmail, password, "answer");
		await viewPersonalProfilePage.CompleteUserData("Demo", "Demo", "1111111111", "DemoStreet", "DemoTown", "UT", "84405");
		return expect(browser.currentUrl()).to.eventually.contain("account/Home");
	});

	it("Should allow customers to login", async() => {
		const homePage = new HomePage(browser);
		await homePage.navigate();
		const loginPage = await homePage.GoToLoginPage() as LoginPage;
		await loginPage.Login(demoEmail, password);
		return expect(browser.currentUrl()).to.eventually.contain("account/Home");
	});

	it("Should allow employees to login", async() => {
		const homePage = new HomePage(browser);
		await homePage.navigate();
		const loginPage = await homePage.GoToLoginPage() as LoginPage;
		await loginPage.Login(`${config.testEmployee.username}`, `${config.testEmployee.password}`);
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
