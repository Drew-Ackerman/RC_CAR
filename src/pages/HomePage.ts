import { Browser, findByClass, urlIsValue, WebComponent } from "../lib";
import { config } from "../../config";
import { Page } from "../partials/page";

/**
 * @classdesc POM for the home page of RC Willey
 */
export class HomePage extends Page{

	@findByClass("rcwlogo")
	public rcLogo : WebComponent;

	constructor(browser: Browser){
		super(browser);
		this.setUrl( `${config.baseUrl}`);
	}

	/**
	 * Click the account button
	 * @returns A promise for a login page POM
	 */
	async goToLoginPage(){
		return this.header.clickAccountButton();
	}

	/**
	 * The home page is loaded when the RC logo is visible
	 * @returns A conditon that evaluates when the logo is visible. 
	 */ 
	public loadCondition() {
		return urlIsValue(this.browser, config.baseUrl);
	}
}