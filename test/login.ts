import { HomePage } from "../src/pages";
import { Browser, getRandomInt } from "../src/lib";
import { config, SupportedBrowsers } from "../config";
import { LoginPage } from "../src/pages/LoginPage";
import { snapshot } from "../src/lib/snapshot";

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var expect = chai.expect;

require("chromedriver");

function createDemoEmail(){
    return `demo${getRandomInt()}@rcwilley.com`;
}

/**
 * A smoke test suite to ensure basic site functionality 
 * is operational.
 */
describe('The login page', () => {  

    let browser: Browser;
    const demoEmail: string = createDemoEmail();
    const password: string = 'Password1!';

    /**
     * Before all tests are run
     */
    beforeEach(async () => {
        browser = await new Browser(SupportedBrowsers.Chrome);
        browser.addCookie({name:"SiteSessionId", value:'34632632462346'});
    });

    it('Should allow an account to be created', async() => {
        let homePage = new HomePage(browser);
        homePage.navigate();
        let loginPage = await homePage.GoToLoginPage() as LoginPage;
        let accountHelpPage = await loginPage.setupNewAccount();
        let accountCreationPage = await accountHelpPage.gotoAccountCreation();
        let viewPersonalProfilePage = await accountCreationPage.CreateNewAccount(demoEmail, password, 'answer');
        await viewPersonalProfilePage.CompleteUserData('Demo', 'Demo', '1111111111', 'DemoStreet', 'DemoTown', 'UT', '84405');
        return expect(browser.currentUrl()).to.eventually.contain('account/Home');
    });

    it('Should allow customers to login', async() => {
        let homePage = new HomePage(browser);
        await homePage.navigate();
        let loginPage = await homePage.GoToLoginPage() as LoginPage;
        await loginPage.Login(demoEmail, password);
        return expect(browser.currentUrl()).to.eventually.contain('account/Home');
    });

    it('Should allow employees to login', async() => {
        let homePage = new HomePage(browser);
        await homePage.navigate();
        let loginPage = await homePage.GoToLoginPage() as LoginPage;
        await loginPage.Login(`${config.testEmployee.username}`, `${config.testEmployee.password}`);
        return expect(browser.currentUrl()).to.eventually.contain('account/Home');
    });

    /**
     * After all tests are run
     */
    afterEach(async function () {

        //Check if the test that just ran was not successful
        if(this.currentTest?.state !== 'passed'){
            snapshot(this, browser);
        }
        await browser.close();
    });
});
