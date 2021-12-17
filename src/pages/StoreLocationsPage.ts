import { Browser, Button, findByCSS, pageHasLoaded, urlContainsValue, WaitCondition, WebComponent, WebComponents } from "../lib";
import { StoreMapPage } from "./StoreMapPage";
import { Page } from "../components/page";


export class StoreLocationsPage extends Page {
	
	@findByCSS("a[href='/Store-Map']")
	private allStoresMapButton: Button;

	constructor(browser: Browser){
		super(browser);
	}

	/**
	 * Returns Webcomponetns that are the root element of each store location card.
	 * @returns A promise for webcomponents. 
	 */
	public async getStoreLocations():Promise<WebComponents> {
		const slcontainer = new WebComponent(this.browser.findElement({id:"storeLocations"}), "storeLocations");
		const locations = new WebComponents(slcontainer.findElements({css:"div[class~='locationBox']"}), "div[class~='locationBox']");
		return locations;
	}

	/**
	 * Click all stores map button 
	 * @returns StoreMapPage
	 */
	public async clickAllStoresMapButton(): Promise<StoreMapPage> {
		await this.allStoresMapButton.click();
		await this.browser.wait(pageHasLoaded(StoreMapPage));
		return new StoreMapPage(this.browser);
	}
	
	/**
	 * This page is loaded when url contains Store-Locations.
	 * @returns Url WaitCondition
	 */
	public loadCondition(): WaitCondition {
		return urlContainsValue(this.browser, "Store-Locations");
	}
	
}