import { AccountSideBar } from "../components/AccountSideBar";
import { Page } from "../components/page";
import { IBrowser } from "../interfaces/IBrowser";
import { findByLinkText, urlContainsValue, WaitCondition, WebComponent } from "../lib";

export class AccountHomePage extends Page {
	
	@findByLinkText("Statements")
	public StatementLink: WebComponent;

	@findByLinkText("Account Activity")
	public AccountActivityLink: WebComponent;
	
	public sidebar: AccountSideBar;

	constructor(browser:IBrowser){
		super(browser);
		this.sidebar = new AccountSideBar(browser);
	}
	
	public loadCondition(): WaitCondition {
		return urlContainsValue(this.browser, "/account/Home");
	}    
}