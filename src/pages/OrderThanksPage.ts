import { IHeader } from "../interfaces/IHeader";
import { IPage } from "../interfaces/IPage";
import { Browser, findById, urlContainsValue, WaitCondition, WebComponent } from "../lib";

export class OrderThanksPage implements IPage {
	
	header: IHeader;
	url: string;

	@findById("orderConfirmationP")
	private orderConfirmationText: WebComponent;

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

	public async getOrderNumber(): Promise<string>{
		const orderNumberElem = await this.orderConfirmationText.findElement({css:"strong"});
		return orderNumberElem.getText();
	}

}