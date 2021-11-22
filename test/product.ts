import { HomePage } from "../src/pages";
import { Browser } from "../src/lib";
import { SupportedBrowsers } from "../config";
import { LoginPage } from "../src/pages/LoginPage";
import { ProductSearchPage } from "../src/pages/ProductSearchPage";
import { expect } from 'chai';

require("chromedriver");

/**
 * A smoke test suite to ensure basic site functionality 
 * is operational.
 */
describe('Users', () => {  

    let browser: Browser;

    /**
     * Before all tests are run
     */
    before(async () => {
        browser = new Browser(SupportedBrowsers.Chrome);
    });

    // it('a user can login', async() => {
    //     let homePage = new HomePage(browser);
    //     homePage.navigate();
    //     let loginPage = await homePage.GoToLoginPage() as LoginPage;
    //     await loginPage.Login("username", "password");
    //     assert(1==1);
    // });


    it(' should be able to search for products', async() => {
        let homePage = new HomePage(browser);
        homePage.navigate();
        let productPage = await homePage.Search('');
        let productList = await productPage.findAllProductsOnPage();
        expect(productList).to.have.length.greaterThan(0);
    });

    it('Should allow a product to be checked out', async () => {
        let homePage = new HomePage(browser);
        homePage.navigate();
        let productsPage = await homePage.Search('');
        let productsList = await productsPage.findAllProductsOnPage();
        expect(productsList).to.have.length.greaterThan(0);
        let firstProductResult = productsList[0];
        await firstProductResult.Click();

    });

    /**
     * After all tests are run
     */
    after( async() => {
        await browser.close();
    });
});
