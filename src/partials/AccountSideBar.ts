import { WebComponent } from "../lib/elements";
import { findById } from "../lib/utils";
import { IBrowser } from "../interfaces/IBrowser";

/**
 * Options that can be selected on the side bar.
 */
export enum MenuOptions {
	SecuritySettings="/account/View-Customer-Security",
}

/**
 * This component is present on the side of all
 * account pages. 
 */
export class AccountSideBar {
	
	@findById("sideBarMenu")
	private sideBarMenu: WebComponent;

	constructor(protected browser:IBrowser){

	}

	/**
	 * Select a menu option, this will change the account page you're on
	 * @param option The menu option to click.
	 */
	public async selectMenuOption(option:MenuOptions): Promise<void>{
		const menuOption = await this.sideBarMenu.findElement({css:`a[href='${option}']`});
		await menuOption.click();
	}
}