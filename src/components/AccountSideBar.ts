
import { AccountSecurityPage } from "../pages/AccountSecurityPage";
import { WebComponent } from "../lib/elements";
import { findById } from "../lib/utils";
import { pageHasLoaded } from "../lib/conditions";
import { IBrowser } from "../interfaces/IBrowser";

export enum MenuOptions {
	SecuritySettings="/account/View-Customer-Security",
}

export class AccountSideBar {
	
	@findById("sideBarMenu")
	private sideBarMenu: WebComponent;

	constructor(protected browser:IBrowser){

	}

	public async selectMenuOption(option:MenuOptions): Promise<void>{
		const menuOption = await this.sideBarMenu.findElement({css:`a[href='${option}']`});
		await menuOption.click();

		switch(option){
		case MenuOptions.SecuritySettings:
			//await this.browser.wait(pageHasLoaded(AccountSecurityPage));
		}
	}


}