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
exports.TextInput = exports.Button = exports.WebComponents = exports.WebComponent = void 0;
/**
 * @classdesc A wrapper for all possible html elements.
 */
class WebComponent {
    constructor(element, selector) {
        this.element = element;
        this.selector = selector;
    }
    /**
     * @returns Determine if a web element is displayed.
     */
    isDisplayed() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.element.isDisplayed();
            }
            catch (ex) {
                return false;
            }
        });
    }
    /**
     * @return Attempt to click a web element.
     */
    click() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.element.click();
            }
            catch (clickErr) {
                try {
                    yield this.element.getDriver().executeScript('arguements[0].click();', this.element);
                }
                catch (jsErr) {
                    throw clickErr;
                }
            }
        });
    }
    /**
     * @returns The elements visible text.
     */
    getText() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.element.getText();
        });
    }
}
exports.WebComponent = WebComponent;
class WebComponents {
    constructor(elements, selector) {
        this.elements = elements;
        this.selector = selector;
    }
    ;
    getDisplayed() {
        return __awaiter(this, void 0, void 0, function* () {
            this.elements.forEach((element) => {
                console.log(element);
            });
        });
    }
    ;
}
exports.WebComponents = WebComponents;
/**
 * @classdesc A wrapper for button elements.
 */
class Button extends WebComponent {
    /**
     * @constructor
     * @param element A Promise that will return a web element
     * @param selector How to find that element
     */
    constructor(element, selector) {
        super(element, selector);
    }
    /**
     * @return Determine if the button is disabled
     */
    isDisplayed() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return (yield this.element.getAttribute('disabled')) === 'disabled';
            }
            catch (ex) {
                return false;
            }
        });
    }
}
exports.Button = Button;
/**
 * @classdesc A wrapper for input elements
 */
class TextInput extends WebComponent {
    /**
     * @class
     * @param element A Promise to return a web element
     * @param selector How to find that element
     */
    constructor(element, selector) {
        super(element, selector);
    }
    /**
     *
     * @param text The text to type into the input field.
     * @returns A Promise that will evaluate after the typing is done.
     */
    type(text) {
        return this.element.sendKeys(text);
    }
}
exports.TextInput = TextInput;
