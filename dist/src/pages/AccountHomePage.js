"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountHomePage = void 0;
const lib_1 = require("../lib");
class AccountHomePage extends lib_1.Page {
    constructor(browser) {
        super(browser);
    }
    loadCondition() {
        return (0, lib_1.urlContainsValue)(this.browser, '/account/Home');
    }
}
exports.AccountHomePage = AccountHomePage;
