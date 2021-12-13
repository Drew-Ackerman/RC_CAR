import { Locator, WebElement, WebElementPromise } from "selenium-webdriver";

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
				await this.element.getDriver().executeScript("arguements[0].click();", this.element);
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

	/**
	 * 
	 * @param locator A selenium By locator hash.
	 * @returns A {@link WebElementPromise}
	 */
	public findElement(locator: Locator): WebElementPromise{
		return this.element.findElement(locator);
	}

	/**
	 * 
	 * @param locator A selenium By locator hash.
	 * @returns A promise that returns an array of {@link WebElement}
	 */
	public findElements(locator: Locator):Promise<Array<WebElement>>{
		return this.element.findElements(locator);
	}
}

/**
 * This class allows handling multiple WebElements at once. 
 */
export class WebComponents {

	constructor(protected elements: Promise<Array<WebElement>>, public selector: string)
	{

	}

	/**
	 * @returns All the elements in this collection
	 */
	public async getElements(): Promise<Array<WebElement>>{
		return await this.elements;
	}

	/**
	 * @returns All elements in the collection that are visible. 
	 */
	public async getDisplayed(): Promise<Array<WebElement>>{
		return (await this.elements).filter(async (element) => {
			if(await element.isDisplayed()){
				return element;
			}
		});
	}
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
			return await this.element.getAttribute("disabled") === "disabled";
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
	public type(...varArgs:(string|number|Promise<string|number>)[]): Promise<void>{
		return this.element.sendKeys(...varArgs);
	}

	/**
	 * Clear the text out of the text Input.
	 * @returns 
	 */
	public clear(): Promise<void>{
		return this.element.clear();
	}
}

/**
 * @classdesc A wrapper for selector elements.
 */
export class Selector extends WebComponent {
	
	constructor(element: WebElementPromise, selector: string){
		super(element,selector);
	}

	/**
	 * Select an option of the selector. 
	 * @param selectedOption 
	 */
	public async selectOptionByValue(selectedOption: string){
		const options = await this.element.findElements({css:"option"});
		options.forEach(async (option) => {
			if(await option.getAttribute("value") == selectedOption){
				await option.click();
				return;
			}
			if(await (await option.getText()).includes(selectedOption)){
				await option.click();
				return;
			}
		});
		throw new Error(`Option ${selectedOption} not present on element ${this}`);
	}

	/**
	 * Choose a selector option by its visible text value. 
	 * @param selectedOption The entire text to match, or a substring. 
	 */
	public async selectOptionByText(selectedOption: string){
		const options = await this.element.findElements({css:"option"});
		options.forEach(async (option) => {
			if(await (await option.getText()).includes(selectedOption)){
				await option.click();
				return;
			}
		});
		throw new Error(`Option ${selectedOption} not present on element ${this}`);
	}
}