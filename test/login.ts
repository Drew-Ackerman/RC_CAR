import { HomePage } from "../src/pages";
import { Browser, getRandomInt } from "../src/lib";
import { config, SupportedBrowsers } from "../config";
import { LoginPage } from "../src/pages/LoginPage";
import path = require("path");
import { accessSync, constants, mkdirSync } from "fs";

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
            //Record the screen and place that data somewhere          
            let friendlyTestName = this.currentTest?.title.split(' ').join('_'); //Replace spaces with underscores

            let testFilePath = this.currentTest?.file || ""; //The full file path of the currently running test
            let testDirectory = path.dirname(testFilePath);
            let testResultsDirectory = path.join(testDirectory, 'results');

            //Create the directory, if it exists then thats okay
            try{
                accessSync(testResultsDirectory, constants.R_OK | constants.W_OK);
            }catch(err){
                //Dir doesnt exist
                try{
                mkdirSync(testResultsDirectory)
                } catch(err){
                    console.log("Error making directory for", err)
                }
            }

            let screenshotPath = path.join(testResultsDirectory, `${friendlyTestName}.png`)
            await browser.takeScreenshot(screenshotPath);
        }
        await browser.close();
    });
});
