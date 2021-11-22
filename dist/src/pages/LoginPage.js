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
exports.LoginPage = exports.LoginPageUrl = void 0;
const lib_1 = require("../lib");
const elements_1 = require("../lib/elements");
const AccountHelpPage_1 = require("./AccountHelpPage");
exports.LoginPageUrl = "https://www.rcwilley.com/account/Home";
/**
 * @classdesc POM for the Login page.
 */
class LoginPage extends lib_1.Page {
    constructor(browser) {
        super(browser);
    }
    /**
     * Login by filling out the form and submitting it.
     * @param username The username to use
     * @param password The password to use
     */
    Login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.UsernameInput.type(username);
            yield this.PasswordInput.type(password);
            yield this.SignInButton.click();
        });
    }
    /**
     * We know the LoginPage is visible when the LoginForm is visible.
     * @returns A promise
     */
    loadCondition() {
        return (0, lib_1.elementIsVisible)(() => this.LoginForm);
    }
    setupNewAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.SetupNewAccountBtn.click();
            this.browser.wait((0, lib_1.pageHasLoaded)(AccountHelpPage_1.AccountHelpPage));
        });
    }
}
__decorate([
    (0, lib_1.findByClass)('buttonGroupCenter'),
    __metadata("design:type", elements_1.TextInput)
], LoginPage.prototype, "SignInGroup", void 0);
__decorate([
    (0, lib_1.findById)('j_password'),
    __metadata("design:type", elements_1.TextInput)
], LoginPage.prototype, "PasswordInput", void 0);
__decorate([
    (0, lib_1.findById)('j_username'),
    __metadata("design:type", elements_1.TextInput)
], LoginPage.prototype, "UsernameInput", void 0);
__decorate([
    (0, lib_1.findById)('login'),
    __metadata("design:type", elements_1.WebComponent)
], LoginPage.prototype, "LoginForm", void 0);
__decorate([
    (0, lib_1.findByCSS)("type=['submit']"),
    __metadata("design:type", elements_1.Button)
], LoginPage.prototype, "SignInButton", void 0);
__decorate([
    (0, lib_1.findByLinkText)('Setup New Account'),
    __metadata("design:type", elements_1.Button)
], LoginPage.prototype, "SetupNewAccountBtn", void 0);
exports.LoginPage = LoginPage;
