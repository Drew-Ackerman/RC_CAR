import { IBrowser } from "../interfaces/IBrowser";
import { Button, elementIsVisible, findByCSS, Selector, WebComponent } from "../lib";

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
 * For working with the home store popup
 */
export class SetHomeStorePopup {
	@findByCSS("div[class='md-modal md-scale md-show'")
	private PopupOverlay: WebComponent;

	constructor(protected browser: IBrowser){ }

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
	 * Choose a home store option from the selector. 
	 * @param storeOption The store option to choose from the selector element.
	 */
	public async selectHomeStore(storeOption:StoreOptions){
		const homestoreSelector = new Selector(this.PopupOverlay.findElement({id:"homeStoreSelect"}), "homeStoreSelect");
		await homestoreSelector.selectOptionByValue(storeOption);
		const continueButton = new Button(this.PopupOverlay.findElement({css:"button[type='submit']"}), "button[type='submit']");
		await continueButton.click();
	}
}