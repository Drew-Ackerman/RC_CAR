import { Key } from "selenium-webdriver";
import { IBrowser } from "../interfaces/IBrowser";
import { elementIsVisible, findByCSS, WebComponent } from "../lib";

/**
 * For working with a zipcoded popup,
 * like the one given when changing stores.
 */
export class ZipcodePopup {

	@findByCSS("div[class='md-modal md-scale md-show'")
	private popupOverlay: WebComponent;

	constructor(protected browser: IBrowser){

	}

	/**
	 * Wait till the popup is visible. 
	 * @param optionalTimeout How many seconds to wait till the popup is visible.
	 */
	public async waitTillVisible(optionalTimeout?:number): Promise<void>{
		await this.browser.wait(elementIsVisible(() => this.popupOverlay), optionalTimeout, `Zipcode popup did not appear within ${optionalTimeout} seconds.`);
	}

	/**
	 * Waits until the zipcode popup is visible, then
	 * Type the zipcode into the input, and submit. 
	 * @param zip 
	 */
	public async typeZipcode(zip:string, optionalTimeout?:number) {
		await this.waitTillVisible(optionalTimeout);
		try{
			const zipInput = await this.popupOverlay.findElement({css:"input[name='zipCode']"});
			await zipInput.sendKeys(`${zip}`, Key.ENTER);
		} catch(error){
			throw new Error(`Couldnt type zip ${zip} into zipcode popup due to ${error}`);
		}
	}
}