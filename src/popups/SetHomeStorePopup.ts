import { IBrowser } from "../interfaces/IBrowser";
import { Button, componentIsVisible, findByCSS, Selector, WebComponent } from "../lib";

/**
 * A list of store options that the 
 * select home store select users. The value 
 * is tied to the values in the selectors option elements. 
 */
export enum StoreOptions {
	NoLocalStore="0",
	Draper="80",
	Layton="63",
	Riverdale="68",
	SouthSaltLake="66",
	Orem="81",
	Henderson="72",
	Reno="77",
	Summerlin="74",
	Boise="71",
	Rocklin="78",
	Sacramento="82",
	Clear="clear",
}

/**
 * For working with the set home store popup
 */
export class SetHomeStorePopup {
	@findByCSS("div[class='md-modal md-scale md-show'")
	private popupOverlay: WebComponent;

	constructor(protected browser: IBrowser){ }

	/**
	 * Wait till the popup is visible. 
	 */
	public async waitTillVisible(optionalTimeout?:number): Promise<void>{
		await this.browser.wait(componentIsVisible(() => this.popupOverlay), optionalTimeout, `Home store popup did not appear within ${optionalTimeout} seconds.`);
	}

	/**
	 * Choose a home store option from the selector. 
	 * @param storeOption The store option to choose from the selector element.
	 * @param optionalTimeout How long to wait for the popup to appear.
	 */
	public async selectHomeStore(storeOption:StoreOptions, optionalTimeout?:number){
		await this.waitTillVisible(optionalTimeout);
		try{
			const homestoreSelector = new Selector(this.popupOverlay.findElement({id:"homeStoreSelect"}), "homeStoreSelect");
			await homestoreSelector.selectOptionByValue(storeOption);
			const continueButton = new Button(this.popupOverlay.findElement({css:"button[type='submit']"}), "button[type='submit']");
			await continueButton.click();
		}catch(error){
			throw new Error(`Unable to select store option ${storeOption} due to error ${error}`);
		}
	}
}