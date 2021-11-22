"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByCSS = exports.findByName = exports.findByLinkText = exports.findAllByClass = exports.findByClass = exports.findById = exports.delay = void 0;
require("reflect-metadata");
//Effectively a promise to pause, be sure to await it. 
/**
 * A promise to pause code execution
 * @param seconds How many seconds to pause
 * @returns A promise
 */
const delay = (seconds) => {
    return new Promise((callback) => setTimeout(callback, seconds * 1000));
};
exports.delay = delay;
/**
 * Use as a decorator on a WebComponent property of a POM
 * Find an element by their css ID
 * @param idSelector The ID
 * @returns Nothing.
 */
function findById(idSelector) {
    return (target, propertyKey) => {
        const type = Reflect.getMetadata('design:type', target, propertyKey);
        Object.defineProperty(target, propertyKey, {
            configurable: true,
            enumerable: true,
            get: function () {
                const promise = this.browser.findElement({ id: `${idSelector}` });
                return new type(promise, idSelector);
            },
        });
    };
}
exports.findById = findById;
;
/**
 * Use as a decorator on a WebComponent property of a POM
 * Find an element by their css class
 * @param selector The css class name selector
 * @returns Nothing.
 */
function findByClass(selector) {
    return (target, propertyKey) => {
        const type = Reflect.getMetadata('design:type', target, propertyKey);
        Object.defineProperty(target, propertyKey, {
            configurable: true,
            enumerable: true,
            get: function () {
                const promise = this.browser.findElement({ css: `${selector}` });
                return new type(promise, selector);
            },
        });
    };
}
exports.findByClass = findByClass;
;
function findAllByClass(selector) {
    return (target, propertyKey) => {
        const type = Reflect.getMetadata('design:type', target, propertyKey);
        Object.defineProperty(target, propertyKey, {
            configurable: true,
            enumerable: true,
            get: function () {
                const promise = this.browser.findElements({ css: `${selector}` });
                return new Array(promise, selector);
            },
        });
    };
}
exports.findAllByClass = findAllByClass;
;
/**
 * Use as a decorator on a WebComponent property of a POM
 * Find an element by their _visible_ link text, used on <a> tags.
 * @param linkText The links tags text
 * @returns Nothing.
 */
function findByLinkText(linkText) {
    return (target, propertyKey) => {
        const type = Reflect.getMetadata('design:type', target, propertyKey);
        Object.defineProperty(target, propertyKey, {
            configurable: true,
            enumerable: true,
            get: function () {
                const promise = this.browser.findElement({ linkText: `${linkText}` });
                return new type(promise, linkText);
            },
        });
    };
}
exports.findByLinkText = findByLinkText;
;
function findByName(nameValue) {
    return (target, propertyKey) => {
        const type = Reflect.getMetadata('design:type', target, propertyKey);
        Object.defineProperty(target, propertyKey, {
            configurable: true,
            enumerable: true,
            get: function () {
                const promise = this.browser.findElement({ name: `${nameValue}` });
                return new type(promise, nameValue);
            },
        });
    };
}
exports.findByName = findByName;
;
function findByCSS(cssIdentifier) {
    return (target, propertyKey) => {
        const type = Reflect.getMetadata('design:type', target, propertyKey);
        Object.defineProperty(target, propertyKey, {
            configurable: true,
            enumerable: true,
            get: function () {
                const promise = this.browser.findElement({ css: `${cssIdentifier}` });
                return new type(promise, cssIdentifier);
            },
        });
    };
}
exports.findByCSS = findByCSS;
;
