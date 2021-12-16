import { Key } from "selenium-webdriver";
import { Browser, Button, elementIsVisible, findByClass, findByCSS, findById, findByLinkText, pageHasLoaded, TextInput, WebComponent } from "../lib";
import { AccountHomePage } from "../pages/accountPages";
import { LoginPage } from "../pages/LoginPage";
import { ProductSearchPage } from "../pages/ProductSearchPage";
import { ShoppingCartPage } from "../pages/ShoppingCartPage";
import { StoreLocationsPage } from "../pages/StoreLocationsPage";

/**
 * @classdesc The header is the part of the page that contains things like 
 * the logo, navigation, and the search bar. 
 * Add this component to pages that contain the header if theres things from the header
 * that you need.
 */
export class Header{

	constructor(private browser:Browser){ }

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
	private LocationButton: Button;

	@findByClass("homeStoreCity")
	private homeStoreLocationChangeLink: WebComponent;

	/**
	 * Click the account button
	 */
	public async clickAccountButton(){
		//User isnt logged in yet then
		let loginButtonPresent = false;
		try{
			loginButtonPresent = await this.LoginButton.isDisplayed();
		} catch(error){
			console.log("nope");
		}
		
		if(loginButtonPresent){
			await this.LoginButton.click();
			await this.browser.wait(pageHasLoaded(LoginPage));
			return new LoginPage(this.browser);
		}
		//Otherwise user is logged in
		else{
			await this.AccountButton.click();
			await this.browser.wait(pageHasLoaded(AccountHomePage));
			return new AccountHomePage(this.browser);
		}
	}

	/**
	 * Types into the search text input and then sends the enter key. 
	 * @param searchText What text to input into the text box
	 * @returns A {@link ProductSearchPage}
	 */
	public async searchForItem(searchText:string): Promise<ProductSearchPage>{
		await this.SearchBoxInput.type(searchText);
		await this.SearchBoxInput.type(Key.ENTER);
		await this.browser.wait(pageHasLoaded(ProductSearchPage));
		return new ProductSearchPage(this.browser);
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
	 * Click location button
	 * @returns Promise for a StoreLocationpage
	 */
	public async clickLocationButton(): Promise<StoreLocationsPage> {
		await this.LocationButton.click();
		await this.browser.wait(pageHasLoaded(StoreLocationsPage));
		return new StoreLocationsPage(this.browser);
	}

	/**
	 * Click the shopping cart button thats in the pages header. 
	 * @returns A {@link ShoppingCartPage}
	 */
	public async clickShoppingCartButton(): Promise<ShoppingCartPage>{
		await this.CartButton.click();
		return new ShoppingCartPage(this.browser);
	}
}