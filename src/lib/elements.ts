import { Locator, WebElement, WebElementCondition, WebElementPromise } from "selenium-webdriver";

/**
 * @classdesc A wrapper for all possible html elements.
 */
export class WebComponent {

    constructor(protected element: WebElementPromise, public selector: string){ }

    /**
     * @returns Determine if a web element is displayed. 
     */
    public async isDisplayed(){
        try {
            return await this.element.isDisplayed();
        }
        catch (ex) {
            return false;
        }
    }

    /**
     * @return Attempt to click a web element. 
     */
    public async click() {
        try {
            return await this.element.click();
        } catch (clickErr) {
            try {
                await this.element.getDriver().executeScript('arguements[0].click();', this.element);
            } catch (jsErr) {
                throw clickErr;
            }
        }
    }

    /**
     * @returns The elements visible text. 
     */
    public async getText() {
        return await this.element.getText();
    }

    public findElement(locator: Locator): WebElementPromise{
        return this.element.findElement(locator);
    }
}

export class WebComponents {

    constructor(protected elements: Promise<Array<WebElement>>, public selector: string)
    {

    };

    public async getElements(){
        return await this.elements;
    }

    public async getDisplayed(){
        let e = await this.elements;
        e.forEach( (element) => {
            console.log(element);
        });
    };
}

/**
 * @classdesc A wrapper for button elements. 
 */
export class Button extends WebComponent {

    /**
     * @constructor
     * @param element A Promise that will return a web element
     * @param selector How to find that element
     */
    constructor(element: WebElementPromise, selector: string) {
        super(element, selector);
    }

    /**
     * @return Determine if the button is disabled
     */
    public async isDisabled() {
        try {
            return await this.element.getAttribute('disabled') === 'disabled';
        } catch (ex) {
            return false;
        }
    }
}

/**
 * @classdesc A wrapper for input elements
 */
export class TextInput extends WebComponent {

    /**
     * @class
     * @param element A Promise to return a web element
     * @param selector How to find that element
     */
    constructor(element: WebElementPromise, selector: string){
        super(element,selector);
    }

    /**
     * 
     * @param text The text to type into the input field.
     * @returns A Promise that will evaluate after the typing is done. 
     */
    public type(text:string) : Promise<void>{
        return this.element.sendKeys(text);
    }

    public clear(): Promise<void>{
        return this.element.clear();
    }
}