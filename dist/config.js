"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportedBrowsers = exports.config = void 0;
/**
 * A configuration object for common variables used throughout RC_CAR
 */
exports.config = {
    baseUrl: process.env.BASE_URL || 'https://rcwtest.rcwilley.com/',
};
/**
 * @enum List of supported browsers that can be used for testing.
 */
var SupportedBrowsers;
(function (SupportedBrowsers) {
    SupportedBrowsers["Chrome"] = "chrome";
    SupportedBrowsers["Firefox"] = "firefox";
})(SupportedBrowsers = exports.SupportedBrowsers || (exports.SupportedBrowsers = {}));
