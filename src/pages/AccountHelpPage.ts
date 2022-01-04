import { findByLinkText, urlContainsValue, WaitCondition, WebComponent } from "../lib";
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
	}

	public loadCondition(): WaitCondition {
		return urlContainsValue(this.browser, "Account-Help");
	}
}