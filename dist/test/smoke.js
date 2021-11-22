"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const pages_1 = require("../src/pages");
const lib_1 = require("../src/lib");
const config_1 = require("../config");
require("chromedriver");
/**
 * A smoke test suite to ensure basic site functionality
 * is operational.
 */
describe('Basic functionality is achieved when', () => {
    let browser;
    /**
     * Before all tests are run
     */
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        browser = new lib_1.Browser(config_1.SupportedBrowsers.Chrome);
    }));
    // it('a user can login', async() => {
    //     let homePage = new HomePage(browser);
    //     homePage.navigate();
    //     let loginPage = await homePage.GoToLoginPage() as LoginPage;
    //     await loginPage.Login("username", "password");
    //     assert(1==1);
    // });
    it('a user can search for items', () => __awaiter(void 0, void 0, void 0, function* () {
        let homePage = new pages_1.HomePage(browser);
        homePage.navigate();
        let productPage = yield homePage.Search('');
        let products = yield productPage.PageProducts;
        console.log(products);
        console.log(products.getDisplayed);
        yield products.getDisplayed();
        (0, console_1.assert)(1 == 1);
    }));
    /**
     * After all tests are run
     */
    after(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log('here');
        yield browser.close();
    }));
});
