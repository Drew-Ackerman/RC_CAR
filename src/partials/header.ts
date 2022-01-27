import { Key } from "selenium-webdriver";
import { IBrowser } from "../interfaces/IBrowser";
import { IHeader } from "../interfaces/IHeader";
import { Button, componentIsVisible, findByClass, findByCSS, findById, findByLinkText, TextInput, WebComponent } from "../lib";

/**
 * @classdesc The header is the part of the page that contains things like 
 * the logo, navigation, and the search bar. 
 * Add this component to pages that contain the header if theres things from the header
 * that you need.
 */
export class Header implements IHeader{

	constructor(private browser:IBrowser){ }

	/**
	 * When logged in the account button can be found this way
	 */
	@findById("accountHeaderIcon")
	public accountButton: Button;

	@findById("header")
	public headerBar: WebComponent;

	@findById("searchBox")
	public searchBoxInput : TextInput;

	@findById("cartHeaderIcon")
	private cartButton: Button;

	@findByLinkText("Logout")
	public logoutButton: Button;

	@findById("locationsHeaderIcon")
	private locationButton: Button;

	@findByClass("homeStoreCity")
	public homeStoreLocationChangeLink: WebComponent;

	@findByCSS("nav[aria-label='Account Menu']")
	private accountMenu: WebComponent;

	/**
	 * Click the account button. 
	 * This will either go to the login page, 
	 * or if logged in, will go to the account page.
	 */
	public async clickAccountButton(){
		await this.accountButton.click();
	}

	/**
	 * Types into the search text input and then sends the enter key. 
	 * This should send you to the {@link ProductSearchPage}
	 * @param searchText What text to input into the search text box.
	 */
	public async searchForItem(searchText:string){
		await this.searchBoxInput.type(searchText);
		await this.searchBoxInput.type(Key.ENTER);
	}

	/**
	 * @description Logout of the site
	 */
	public async logout(){
		if(await this.accountButton.isDisplayed()){
			await this.accountButton.click();
			await this.browser.wait(componentIsVisible(()=>this.logoutButton));
			await this.logoutButton.click();
			await this.browser.wait(componentIsVisible(()=>this.accountButton));
		}
		else{
			throw Error("The account button is not displayed in the header bar");
		}
	}

	/**
	 * Clicking this link either opens up the zipcode dialog or
	 * if a location has already been set then a dialog with a selector element 
	 * is given. 
	 */
	public changeHomeStore(): Promise<void>{
		return this.homeStoreLocationChangeLink.click();
	}

	/**
	 * Click location button.
	 * Changes the page to a {@link StoreLocationsPage}
	 */
	public async clickLocationButton(){
		await this.locationButton.click();
	}

	/**
	 * Click the shopping cart button thats in the pages header. 
	 * Changes the page to a {@link ShoppingCartPage}
	 */
	public async clickShoppingCartButton(){
		await this.cartButton.click();
	}

	/**
	 * Select an account menu option, only accessible if a user is logged in. 
	 * @param optionToSelect The option in the account menu
	 */
	public async selectAccountMenuOption(optionToSelect: string): Promise<void>{
		await this.clickAccountButton();
		await this.browser.wait(componentIsVisible(()=>this.accountMenu));
		const accountMenuElements = await this.accountMenu.findElements({css:"li"});
		for(const menuOption of accountMenuElements){
			const menuOptionText = await menuOption.getText();
			if(menuOptionText == optionToSelect){
				await menuOption.click();
				return;
			}
		}
		throw new Error(`Account menu option: ${optionToSelect} not present`);
	}
}