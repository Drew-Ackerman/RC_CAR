import { Button, TextInput, WebComponent } from "../lib/elements";

/**
 * @classdesc The header is the part of the page that contains things like 
 * the logo, navigation, and the search bar. 
 * Add this component to pages that contain the header if theres things from the header
 * that you need.
 */
export interface IHeader{

	/**
	 * When logged in the account button can be found this way
	 */
	AccountButton: Button;

	/**
	 * When not logged in the account button can be found this way
	 */
	LoginButton: Button;

	HeaderBar: WebComponent;

	SearchBoxInput : TextInput;

	logoutButton: Button;

	homeStoreLocationChangeLink: WebComponent;

	/**
	 * Click the account button
	 */
	clickAccountButton():Promise<void>;
	/**
	 * Types into the search text input and then sends the enter key. 
	 * @param searchText What text to input into the text box
	 * @returns A {@link ProductSearchPage}
	 */
	searchForItem(searchText:string):Promise<void>;

	/**
	 * @description Logout of the site
	 */
	logout():Promise<void>;

	/**
	 * Clicking this link either opens up the zipcode dialog or
	 * if a location has already been set then a dialog with a selector element 
	 * is given. 
	 */
	changeHomeStore(): Promise<void>;

	/**
	 * Click location button
	 * @returns Promise for a StoreLocationpage
	 */
	clickLocationButton(): Promise<void>;
	/**
	 * Click the shopping cart button thats in the pages header. 
	 * @returns A {@link ShoppingCartPage}
	 */
	clickShoppingCartButton():Promise<void>;

	selectAccountMenuOption(optionToSelect: string):Promise<void>;

}