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
exports.pageHasLoaded = exports.urlContainsValue = exports.urlIsValue = exports.elementIsPresent = exports.elementIsVisible = void 0;
/**
 * Wait for a WebComponent to be displayed
 * @param locator The WebComponent
 * @returns True if visible, false otherwise.
 */
function elementIsVisible(locator) {
    return () => __awaiter(this, void 0, void 0, function* () { return yield locator().isDisplayed(); });
}
exports.elementIsVisible = elementIsVisible;
/**
 * Ensure a WebComponent is present in the DOM, doesnt mean visible.
 * @param locator The WebComponent
 * @returns A promise to be waited upon.
 */
function elementIsPresent(locator) {
    return () => __awaiter(this, void 0, void 0, function* () { return (yield locator()) !== undefined; });
}
exports.elementIsPresent = elementIsPresent;
/**
 * Create a @WaitCondition that can be used to wait for a specific url to be present in the browser
 * @param browser The browser
 * @param url The url to wait for
 * @returns A promise to be waited upon.
 */
function urlIsValue(browser, url) {
    return () => __awaiter(this, void 0, void 0, function* () { return (yield browser.currentUrl()) === url; });
}
exports.urlIsValue = urlIsValue;
/**
 *
 * @param browser
 * @param partialUrl
 * @returns
 */
function urlContainsValue(browser, partialUrl) {
    return () => __awaiter(this, void 0, void 0, function* () { return yield (yield browser.currentUrl()).includes(partialUrl); });
}
exports.urlContainsValue = urlContainsValue;
/**
 * Instantiate a new page, and then return a Promise that will resolve when
 * a page has loaded. Each page defines its own condtion for when it considers itself loaded.
 * @param page The page that will be instantiated
 * @returns A boolean promise that evaluates when a page is loaded.
 */
function pageHasLoaded(page) {
    return (browser) => {
        const condition = new page(browser).loadCondition();
        return condition(browser);
    };
}
exports.pageHasLoaded = pageHasLoaded;
