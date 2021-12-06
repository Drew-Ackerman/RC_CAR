import { Header } from "../components";
import { Browser, elementIsVisible, findByClass, Page, WebComponent } from "../lib";
import { config } from "../../config";
import { ShoppingCartPage } from "./ShoppingCartPage";

/**
 * @classdesc POM for the home page of RC Willey
 */
export class HomePage extends Page{

	@findByClass("rcwlogo")
	public RCLogo : WebComponent;

	public header: Header;

	constructor(browser: Browser){
		super(browser);
		this.setUrl( `${config.baseUrl}`);
		this.header = new Header(browser);
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

	public async ClickShoppingCartButton(): Promise<ShoppingCartPage>{
		return this.header.clickShoppingCartButton();
	}

	/**
	 * The home page is loaded when the RC logo is visible
	 * @returns A conditon that evaluates when the logo is visible. 
	 */ 
	public loadCondition() {
		return elementIsVisible(() => this.RCLogo);
	}
}