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
exports.Browser = void 0;
require("chromedriver");
const selenium_webdriver_1 = require("selenium-webdriver");
/**
 * @classdesc A wrapper for the selenium browser driver.
 */
class Browser {
    /**
     * @param browserName The browser to use.
     */
    constructor(browserName) {
        this.browserName = browserName;
        this.driver = new selenium_webdriver_1.Builder().forBrowser(browserName).build();
    }
    /**
     * @param url The web url to go to.
     */
    navigate(url) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.driver.navigate().to(url);
        });
    }
    /**
     * Find an element based off a selector hash given,
     * generally use the findBy decorators in utils.ts, but you can directly select
     * things if those are not felxible enough.
     * @param selectorHash A selenium selector hash with {type:locator} like, {css:'.classname'}.
     * @returns A Promise that returns a Web Element, or undefined if not found.
     */
    findElement(selectorHash) {
        return this.driver.findElement(selectorHash);
    }
    findElements(selectorHash) {
        return this.driver.findElements(selectorHash);
    }
    /**
     * @returns The current browser url
     */
    currentUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.driver.getCurrentUrl();
        });
    }
    /**
     * Close the browser.
     */
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.driver.quit();
        });
    }
    /**
     * Clear browser cookies.
     */
    clearCookies() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.driver.manage().deleteAllCookies();
        });
    }
    /**
     * @param seconds The amount of seconds to sleep for
     * @returns A promise to sleep for a period of time.
     */
    sleep(seconds) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.driver.sleep(seconds * 1000);
        });
    }
    /**
     * Wait for a specific condition to be satisfied. Usefull when elements
     * havnt loaded in or when actions take time to occur.
     * @param condition A condition to evaluate
     */
    wait(condition) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.waitAny(condition);
        });
    }
    /**
     * Wait till one of one or many conditoons to be satisfied.
     * @param conditions 1 or many conditions to fulfill.
     */
    waitAny(conditions) {
        return __awaiter(this, void 0, void 0, function* () {
            //Treat all conditions as an array of conditions. 
            const all = (!(conditions instanceof Array)) ? [conditions] : conditions;
            yield this.driver.wait(() => __awaiter(this, void 0, void 0, function* () {
                for (const conditon of all) {
                    //Await the condition.
                    try {
                        if ((yield conditon(this)) === true) {
                            return true;
                        }
                        continue;
                    }
                    catch (ex) {
                        continue;
                    }
                }
            }));
        });
    }
}
exports.Browser = Browser;
