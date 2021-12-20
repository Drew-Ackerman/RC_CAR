import { Key } from "selenium-webdriver";
import { Browser, elementIsVisible, findByCSS, WebComponent } from "../lib";


/**
 * For working with the zipcode popup. 
 */
export class ZipcodePopup {

	@findByCSS("div[class='md-modal md-scale md-show'")
	private PopupOverlay: WebComponent;

	constructor(protected browser: Browser){

	}

	/**
	 * Wait till the popup is visible. 
	 */
	public async waitTillVisible(): Promise<void>{
		try{
			await this.browser.wait(elementIsVisible(() => this.PopupOverlay));
		} catch(error){
			console.error("Couldnt find zip code popup: ", error);
		}
	}

	/**
	 * Type the zipcode into the input, and submit. 
	 * @param zip 
	 */
	public async typeZipcode(zip:string) {
		try{
			const zipInput = await this.PopupOverlay.findElement({css:"input[name='zipCode']"});
			await zipInput.sendKeys(`${zip}`, Key.ENTER);
			await this.browser.sleep(5);
		} catch(error){
			console.error("Couldnt type zip into zipcode popup:", error);
		}
	}
}