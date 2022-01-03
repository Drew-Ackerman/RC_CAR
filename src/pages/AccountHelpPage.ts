import { findByLinkText, pageHasLoaded, urlContainsValue, WaitCondition, WebComponent } from "../lib";
import { AccountCreationPage } from "./AccountCreationPage";
import { Page } from "../components/page";
import { IBrowser } from "../interfaces/IBrowser";

export class AccountHelpPage extends Page{

	@findByLinkText("click here")
	public CreateAccountLink : WebComponent;

	constructor (browser:IBrowser){
		super(browser);
	}

	public async gotoAccountCreation() {
		await this.CreateAccountLink.click();
		//await this.browser.wait(pageHasLoaded(AccountCreationPage));
		//return new AccountCreationPage(this.browser);
	}

	public loadCondition(): WaitCondition {
		return urlContainsValue(this.browser, "Account-Help");
	}
}