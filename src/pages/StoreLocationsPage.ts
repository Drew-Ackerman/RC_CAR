import { Browser, Button, findById, urlContainsValue, WaitCondition, WebComponent, WebComponents } from "../lib";
import { Page } from "../components/page";
import { WebElement } from "selenium-webdriver";

export class StoreLocationsPage extends Page {
	
	@findById("allStoresMapButton")
	private allStoresMapButton: Button;

	constructor(browser: Browser){
		super(browser);
	}

	/**
	 * Returns Webcomponetns that are the root element of each store location card.
	 * @returns A promise for the locations cards as webcomponents. 
	 */
	public async getStoreLocations():Promise<Array<WebElement>> {
		const slcontainer = new WebComponent(this.browser.findElement({id:"storeLocations"}), "storeLocations");
		const locations = new WebComponents(slcontainer.findElements({css:"div[class~='locationBox']"}), "div[class~='locationBox']");
		return locations.getDisplayed();
	}

	/**
	 * Click the all stores map button 
	 * This should navigate to {@link StoreMapPage}
	 */
	public async clickAllStoresMapButton(){
		await this.allStoresMapButton.click();
	}
	
	/**
	 * This page is loaded when url contains Store-Locations.
	 * @returns A wait condition for when the Page has loaded.
	 */
	public loadCondition(): WaitCondition {
		return urlContainsValue(this.browser, "Store-Locations");
	}
	
}