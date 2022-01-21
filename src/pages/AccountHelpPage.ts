import { findByLinkText, urlContainsValue, WaitCondition, WebComponent } from "../lib";
import { Page } from "../components/page";
import { IBrowser } from "../interfaces/IBrowser";

/**
 * The page users go through to create an account.
 */
export class AccountHelpPage extends Page{

	@findByLinkText("click here")
	private createAccountLink : WebComponent;

	constructor (browser:IBrowser){
		super(browser);
	}

	public async gotoAccountCreation() {
		await this.createAccountLink.click();
	}

	public loadCondition(): WaitCondition {
		return urlContainsValue(this.browser, "Account-Help");
	}
}