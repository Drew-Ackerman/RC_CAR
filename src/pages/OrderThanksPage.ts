import { Browser, Page, urlContainsValue, WaitCondition } from "../lib";

export class OrderThanksPage extends Page {
	
	constructor(protected browser:Browser){
		super(browser);
	}
	
	public loadCondition(): WaitCondition {
		return urlContainsValue(this.browser, "Order-Thanks");
	}

}