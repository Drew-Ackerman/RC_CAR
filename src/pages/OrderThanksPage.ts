import { IHeader } from "../interfaces/IHeader";
import { IPage } from "../interfaces/IPage";
import { Browser, findById, urlContainsValue, WaitCondition, WebComponent } from "../lib";

/**
 * The page given after an order is completed.
 */
export class OrderThanksPage implements IPage {
	
	header: IHeader;
	url: string;

	@findById("orderConfirmationP")
	private orderConfirmationText: WebComponent;

	constructor(protected browser:Browser){	}

	public navigate(): Promise<void> {
		return this.browser.navigate(this.url);
	}

	public setUrl(url: string): void {
		this.url = url;
	}
	
	public loadCondition(): WaitCondition {
		return urlContainsValue(this.browser, "Order-Thanks");
	}

	/**
	 * Parse the purchases order number out of the page.
	 * @returns The order number of the completed purchase. 
	 */
	public async getOrderNumber(): Promise<number>{
		const orderNumberElem = await this.orderConfirmationText.findElement({css:"strong"});
		const orderNumber = Number(await orderNumberElem.getText());
		return orderNumber;
	}
}