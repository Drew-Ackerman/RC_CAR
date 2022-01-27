import { Locator, WebElement, WebElementPromise } from "selenium-webdriver";
import { findByXpath } from ".";

/** Components allow interacting with html elements in an easier fashion. 
 * Its best to keep html elements and components 1 to 1. So a button and a selector element 
 * can be a component. A wishlist? Thats not a single html element, its a group of elements and data.
 * So its better to put something complex, like a wishlist, into the partials folder.   
*/

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
				throw new Error(`Tried to click on object with selector ${this.selector}, with javascript, item isnt present, or another element is in the way.`);
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
	 * @param locator A selenium By locator hash.
	 * @returns A {@link WebElementPromise}
	 */
	public findElement(locator: Locator): WebElementPromise{
		return this.element.findElement(locator);
	}

	/**
	 * @param locator A selenium By locator hash.
	 * @returns A promise that returns an array of {@link WebElement}
	 */
	public findElements(locator: Locator):Promise<Array<WebElement>>{
		return this.element.findElements(locator);
	}

	public getAttribute(attributeName: string):Promise<string>{
		return this.element.getAttribute(attributeName);
	}
}

/**
 * This class allows handling multiple WebElements at once. 
 */
export class WebComponents {

	constructor(protected elements: Promise<Array<WebElement>>, public selector: string){	}

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
 * Component for checkbox input elements.
 */
export class Checkbox extends WebComponent {

	constructor(element: WebElementPromise, selector: string){
		super(element, selector);
	}

	/**
	 * See if a checkbox is checked. 
	 * @returns True if checked, otherwise false.
	 */
	public async isChecked(): Promise<boolean>{
		const isChecked = await this.element.getAttribute("checked");
		return isChecked ? true : false;
	}

	/**
	 * Check the checkbox if it is checked, otherwise no-op
	 */
	public async check(): Promise<void>{
		const isChecked = await this.element.getAttribute("value");
		if(!isChecked){
			await this.element.click();
		}
	}

	/**
	 * Uncheck the checkbox if it is checked, otherwise no-op
	 */
	public async uncheck(): Promise<void>{
		const isChecked = await this.element.getAttribute("value");
		if(isChecked){
			await this.element.click();
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

	public async clearAndType(...varArgs:(string|number|Promise<string|number>)[]): Promise<void>{
		await this.clear();
		return this.type(...varArgs);
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
		await this.element.click();
		const options = await this.element.findElements({css:"option"});
		for(const option of options){
			const text = await option.getText();
			const value = await option.getAttribute("value");
			if(value == selectedOption){
				await option.click();
				await this.element.click();
				return;
			}
			if(text.includes(selectedOption)){
				await option.click();
				await this.element.click();
				return;
			}
		}
		throw new Error(`Option ${selectedOption} not present on element ${this}`);
	}

	/**
	 * Choose a selector option by its visible text value. 
	 * @param selectedOption The entire text to match, or a substring. 
	 */
	public async selectOptionByText(selectedOption: string){
		await this.element.click();
		const options = await this.element.findElements({css:"option"});
		for(const option of options){
			const text = await option.getText();
			if(text.includes(selectedOption)){
				await option.click();
				await this.element.click();
				return;
			}
		}
		throw new Error(`Option ${selectedOption} not present on element ${this}`);
	}

	/**
	 * Attempts to select the first available option in a select list,
	 * this means the option is visible and not disabled. 
	 * If an option is available, click it. 
	 * If no options are available, throw an error.
	 * @returns The first available option
	 */
	public async selectFirstAvailableOption(){
		await this.element.click();
		const options = await this.element.findElements({css:"option"});
		for(const option of options){
			const disabled = await option.getAttribute("disabled") == "disabled";
			const visible = await option.isDisplayed();
			if(visible && !disabled){
				await option.click();
				return option;
			}
		}
		throw new Error("Could not find an enabled option");
	}
}

class TableHeader extends WebComponent {
	constructor(element: WebElementPromise, selector: string){
		super(element,selector);
	}

	public async getHeaderColumns(){
		const headerRow = await this.element.findElement({xpath:".//tr"});
		const headerColumns = await headerRow.findElements({xpath:".//th"});
		return headerColumns;
	}
}

class TableBody extends WebComponent {	
	constructor(element: WebElementPromise, selector: string){
		super(element,selector);
	}

	public async getTableRows(){
		const rows = await this.element.findElements({xpath:".//tr"});
		return rows;
	}

	public async getTableCells(){
		const tablesCells = [];
		const rows = await this.getTableRows();
		for(const row of rows){
			const cells = await row.findElements({xpath:".//td"});
			tablesCells.push(...cells);
		}
		return tablesCells;
	}
}

export class Table extends WebComponent {

	@findByXpath(".//thead")
	private tableHead: TableHeader;

	@findByXpath(".//tbody")
	private tableBody: TableBody;

	private browser;
	constructor(element: WebElementPromise, selector: string){
		super(element,selector);
		this.browser = element;
	}

	public async tableHeaders(){
		return this.tableHead.getHeaderColumns();
	}

	public async tableRows(){
		return this.tableBody.getTableRows();
	}

	public async tableCells(){
		return this.tableBody.getTableCells();
	}
}



