import { AccountSecurityPage } from ".";
import { Browser, findById, pageHasLoaded, WebComponent } from "../../lib";

export enum MenuOptions {
	SecuritySettings="/account/View-Customer-Security",
}

export class AccountSideBar {
	
	@findById("sideBarMenu")
	private sideBarMenu: WebComponent;

	constructor(protected browser:Browser){

	}

	public async selectMenuOption(option:MenuOptions): Promise<AccountSecurityPage>{
		const menuOption = await this.sideBarMenu.findElement({css:`a[href='${option}']`});
		await menuOption.click();

		switch(option){
		case MenuOptions.SecuritySettings:
			await this.browser.wait(pageHasLoaded(AccountSecurityPage));
			return new AccountSecurityPage(this.browser);
		}
	}


}