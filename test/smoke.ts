import { HomePage } from "../src/pages";
import { Browser } from "../src/lib";
import { SupportedBrowsers } from "../config";
import { LoginPage } from "../src/pages/LoginPage";
import { getRandomInt } from '../src/lib'

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var expect = chai.expect;

require("chromedriver");

function createDemoEmail(){
    return `demo${getRandomInt()}}@rcwilley.com`;
}

/**
 * A smoke test suite to ensure basic site functionality 
 * is operational.
 */
describe('Basic functionality is achieved when', () => {  

    let browser: Browser;

    /**
     * Before all tests are run
     */
    before(async () => {
        browser = new Browser(SupportedBrowsers.Chrome);
    });

    it('an account can be created', async() => {
        let homePage = new HomePage(browser);
        await homePage.navigate();
        let loginPage = await homePage.GoToLoginPage() as LoginPage;
        let accountHelpPage = await loginPage.setupNewAccount();
        let accountCreationPage = await accountHelpPage.gotoAccountCreation();
        let viewPersonalProfilePage = await accountCreationPage.CreateNewAccount(`${createDemoEmail()}`, 'Password1!', 'answer');
        await viewPersonalProfilePage.CompleteUserData('Demo', 'Demo', '1111111111', 'DemoStreet', 'DemoTown', 'UT', '84405');
        return expect(browser.currentUrl()).to.eventually.contain('account/Home');
    });

    /**
     * After all tests are run
     */
    after( async() => {
        await browser.close();
    });
});
