import { Browser, findByLinkText, Page, urlContainsValue, WaitCondition, WebComponent } from "../../lib";
import { AccountSideBar } from "./AccountSideBar";

export class AccountHomePage extends Page {
	
	@findByLinkText("Statements")
	public StatementLink: WebComponent;

	@findByLinkText("Account Activity")
	public AccountActivityLink: WebComponent;
	
	public sidebar: AccountSideBar;

	constructor(browser:Browser){
		super(browser);
		this.sidebar = new AccountSideBar(browser);
	}
	
	public loadCondition(): WaitCondition {
		return urlContainsValue(this.browser, "/account/Home");
	}    
}