import { Key, WebElement } from "selenium-webdriver";
import { Browser, Button, findById, TextInput, urlContainsValue, WaitCondition, WebComponent, WebComponents } from "../lib";
import { Page } from "../components/page";

type MapLocationData = {
	storeName: string,
	locationLetter: string,
}

class MapLocation {

	constructor(private element: WebElement){

	}

	/**
	 * @returns The store name for the Map Location.
	 */
	public async storeName(): Promise<string>{
		return this.element.findElement({className:"listDetail"}).getText();
	}

	/**
	 * @returns Each map location is assigned to a letter on the map
	 * this letter is dynamically assigned when the loctions are generated.
	 * The locations list changes depending on what is closest to the user.
	 */
	public async locationLetter(): Promise<string>{
		const letterCont =  this.element.findElement({className:"listLetter"});
		const letterProperty = await letterCont.getAttribute("data-letter");
		return letterProperty;
	}

	public async getData(): Promise<MapLocationData>{
		const storeName = await this.storeName();
		const locLetter = await this.locationLetter();
		return {storeName: storeName, locationLetter:locLetter};
	}
}

export class StoreMapPage extends Page{

	@findById("zipCode")
	private zipCodeInput: TextInput;

	@findById("completeStoreListButton")
	private completeStoreListButton: Button;

	constructor(browser:Browser){
		super(browser);
	}

	/**
	 * @returns A collection of all visible map locations.
	 */
	public async getLocations(){
		const locationContainer = new WebComponent(this.browser.findElement({id:"locationList"}), "locationList");
		const locations = new WebComponents(locationContainer.findElements({xpath:".//li"}), ".//li");
		const mapLocations = (await locations.getDisplayed()).map((location) => {
			return new MapLocation(location);
		});
		return mapLocations;
	}

	/**
	 * Performs a filter of the map locations by zipcode.
	 * @param zipCode 
	 */
	public async zipSearch(zipCode:string): Promise<void>{
		await this.zipCodeInput.type(zipCode, Key.ENTER);
	}

	/**
	 * Contains the logic for knowing when a page is loaded.
	 * @returns WaitCondition
	 */
	public loadCondition(): WaitCondition {
		return urlContainsValue(this.browser, "Store-Map");
	}

	/**
	 * Pressing this button takes you back to the {@link StoreLocationsPage}
	 */
	public async goToStoreLocationPage(): Promise<void>{
		await this.completeStoreListButton.click();
	}
}