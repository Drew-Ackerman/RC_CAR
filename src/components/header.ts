import { Key } from "selenium-webdriver";
import { IBrowser } from "../interfaces/IBrowser";
import { IHeader } from "../interfaces/IHeader";
import { Button, elementIsVisible, findByClass, findByCSS, findById, findByLinkText, TextInput, WebComponent } from "../lib";

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
	@findById("myAccount")
	public AccountButton: Button;

	/**
	 * When not logged in the account button can be found this way
	 */
	@findByCSS("img[alt='Account Icon']")
	public LoginButton: Button;

	@findById("header")
	public HeaderBar: WebComponent;

	@findById("searchBox")
	public SearchBoxInput : TextInput;

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
		let loginButtonPresent = false;
		try{
			loginButtonPresent = await this.LoginButton.isDisplayed();
		} catch(error){
			console.error("Cannot click account btn");
		}
		
		if(loginButtonPresent){
			await this.LoginButton.click();
		}
		//Otherwise user is logged in
		else{
			await this.AccountButton.click();
		}
	}

	/**
	 * Types into the search text input and then sends the enter key. 
	 * This should send you to the {@link ProductSearchPage}
	 * @param searchText What text to input into the search text box.
	 */
	public async searchForItem(searchText:string){
		await this.SearchBoxInput.type(searchText);
		await this.SearchBoxInput.type(Key.ENTER);
	}

	/**
	 * @description Logout of the site
	 */
	public async logout(){
		if(await this.AccountButton.isDisplayed()){
			await this.AccountButton.click();
			await this.browser.wait(elementIsVisible(()=>this.logoutButton));
			await this.logoutButton.click();
			await this.browser.wait(elementIsVisible(()=>this.LoginButton));
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
		await this.browser.wait(elementIsVisible(()=>this.accountMenu));
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