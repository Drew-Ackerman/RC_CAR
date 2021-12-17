import { Browser, elementIsVisible, findByClass, WebComponent } from "../lib";
import { config } from "../../config";
import { Page } from "../components/page";

/**
 * @classdesc POM for the home page of RC Willey
 */
export class HomePage extends Page{

	@findByClass("rcwlogo")
	public RCLogo : WebComponent;

	constructor(browser: Browser){
		super(browser);
		this.setUrl( `${config.baseUrl}`);
	}

	/**
	 * Click the account button
	 * @returns A promise for a login page POM
	 */
	async GoToLoginPage(){
		return this.header.clickAccountButton();
	}

	public async Search(searchText:string){
		return this.header.searchForItem(searchText);
	}

	public async ClickShoppingCartButton(){//}: Promise<ShoppingCartPage>{
		this.header.clickShoppingCartButton();
	}

	/**
	 * The home page is loaded when the RC logo is visible
	 * @returns A conditon that evaluates when the logo is visible. 
	 */ 
	public loadCondition() {
		return elementIsVisible(() => this.RCLogo);
	}
}