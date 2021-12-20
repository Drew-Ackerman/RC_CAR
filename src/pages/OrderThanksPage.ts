import { IHeader } from "../interfaces/IHeader";
import { IPage } from "../interfaces/IPage";
import { Browser, urlContainsValue, WaitCondition } from "../lib";

export class OrderThanksPage implements IPage {
	
	header: IHeader;
	url: string;

	constructor(protected browser:Browser){

	}

	public navigate(): Promise<void> {
		return this.browser.navigate(this.url);
	}

	public setUrl(url: string): void {
		this.url = url;
	}
	
	public loadCondition(): WaitCondition {
		return urlContainsValue(this.browser, "Order-Thanks");
	}

}