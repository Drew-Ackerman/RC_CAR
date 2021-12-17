import { Browser, urlContainsValue, WaitCondition } from "../lib";
import { Page } from "../components/page";

export class OrderThanksPage extends Page {
	
	constructor(protected browser:Browser){
		super(browser);
	}
	
	public loadCondition(): WaitCondition {
		return urlContainsValue(this.browser, "Order-Thanks");
	}

}