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

	@findByLinkText("Cart")
	public CartButton: Button;

	@findByLinkText("Logout")
	public LogoutButton: Button;

	@findByLinkText("Locations")
	public LocationButton: Button;

	@findByClass("homeStoreCity")
	public homeStoreLocationChangeLink: WebComponent;

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
			await this.browser.wait(elementIsVisible(()=>this.LogoutButton));
			await this.LogoutButton.click();
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
		await this.LocationButton.click();
	}

	/**
	 * Click the shopping cart button thats in the pages header. 
	 * Changes the page to a {@link ShoppingCartPage}
	 */
	public async clickShoppingCartButton(){
		await this.CartButton.click();
	}
}