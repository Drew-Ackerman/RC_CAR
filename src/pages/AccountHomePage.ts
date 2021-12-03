import { Browser, findByLinkText, Page, urlContainsValue, WaitCondition, WebComponent } from "../lib";

export class AccountHomePage extends Page {
	
	@findByLinkText("Statements")
	public StatementLink: WebComponent;

	@findByLinkText("Account Activity")
	public AccountActivityLink: WebComponent;

	constructor(browser:Browser){
		super(browser);
	}
	
	public loadCondition(): WaitCondition {
		return urlContainsValue(this.browser, "/account/Home");
	}    
}