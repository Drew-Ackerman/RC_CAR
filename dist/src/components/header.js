"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.Header = void 0;
const selenium_webdriver_1 = require("selenium-webdriver");
const lib_1 = require("../lib");
const AccountHomePage_1 = require("../pages/AccountHomePage");
const LoginPage_1 = require("../pages/LoginPage");
const ProductSearchPage_1 = require("../pages/ProductSearchPage");
/**
 * @classdesc The header is the part of the page that contains things like
 * the logo, navigation, and the search bar.
 */
class Header {
    constructor(browser) {
        this.browser = browser;
    }
    /**
     * Click the account button
     */
    ClickAccountButton() {
        return __awaiter(this, void 0, void 0, function* () {
            //User isnt logged in yet then
            let loginButtonPresent = false;
            try {
                loginButtonPresent = yield this.LoginButton.isDisplayed();
            }
            catch (error) {
                //No button;
            }
            if (loginButtonPresent) {
                yield this.LoginButton.click();
                this.browser.wait((0, lib_1.pageHasLoaded)(LoginPage_1.LoginPage));
                return new LoginPage_1.LoginPage(this.browser);
            }
            //Otherwise user is logged in
            else {
                yield this.AccountButton.click();
                this.browser.wait((0, lib_1.pageHasLoaded)(AccountHomePage_1.AccountHomePage));
                return new AccountHomePage_1.AccountHomePage(this.browser);
            }
        });
    }
    ;
    /**
     * Types into the search text input and then sends the enter key.
     * @param searchText What text to input into the text box
     */
    SearchForItem(searchText) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.SearchBoxInput.type(searchText);
            yield this.SearchBoxInput.type(selenium_webdriver_1.Key.ENTER);
            this.browser.wait((0, lib_1.pageHasLoaded)(ProductSearchPage_1.ProductSearchPage));
            return new ProductSearchPage_1.ProductSearchPage(this.browser);
        });
    }
}
__decorate([
    (0, lib_1.findByLinkText)('Account'),
    __metadata("design:type", lib_1.Button)
], Header.prototype, "LoginButton", void 0);
__decorate([
    (0, lib_1.findById)('myAccount'),
    __metadata("design:type", lib_1.Button)
], Header.prototype, "AccountButton", void 0);
__decorate([
    (0, lib_1.findById)('header'),
    __metadata("design:type", lib_1.WebComponent)
], Header.prototype, "HeaderBar", void 0);
__decorate([
    (0, lib_1.findById)('searchBox'),
    __metadata("design:type", lib_1.TextInput)
], Header.prototype, "SearchBoxInput", void 0);
exports.Header = Header;
;
