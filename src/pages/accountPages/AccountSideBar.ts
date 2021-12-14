import { AccountSecurityPage } from ".";
import { Browser, findById, pageHasLoaded, WebComponent } from "../../lib";

export enum MenuOptions {
	SecuritySettings="Security Settings",
}

export class AccountSideBar {
	
	@findById("sideBarMenu")
	private sideBarMenu: WebComponent;

	constructor(protected browser:Browser){

	}

	public async selectMenuOption(option:MenuOptions): Promise<AccountSecurityPage | void>{
		const menuOption = this.sideBarMenu.findElement({linkText:option});
		menuOption.click();

		switch(option){
		case MenuOptions.SecuritySettings:
			await this.browser.wait(pageHasLoaded(AccountSecurityPage));
			return new AccountSecurityPage(this.browser);
		default:
			return;
		}
	}


}