import { WebElement } from "selenium-webdriver";
import { findById, urlContainsValue, WaitCondition, WebComponent, Button } from "../lib";
import { Page } from "../components/page";
import { IBrowser } from "../interfaces/IBrowser";

export const enum GiftCardStyleSets {
	Anytime="Anytime",
	BackToSchool="Back-To-School",
	Birthday="Birthday",
	Easter="Easter",
	FathersDay="Fathers-Day",
	Graduation="Graduation",
	HappyHolidays="Happy-Holidays",
	NewBaby="New-Baby",
	NewHome="New-Home",
	MothersDay="Mothers-Day",
	ValentinesDay="Valentines-Day",
	Wedding="Wedding",
}

export class GiftCard {
	
	@findById("addToCartBtn")
	private addToCartBtn: Button;

	constructor(protected browser: IBrowser, protected element: WebElement){	}

	public async addToCart(): Promise<void> {
		await this.element.click();
		await this.addToCartBtn.click();
	}
}

export class GiftCardPage extends Page {

	@findById("amountOption")
	private amountOptions: WebComponent;

	@findById("cardStyleSet")
	private cardStyleSets: WebComponent;

	constructor(browser:IBrowser){
		super(browser);
	}

	public async isAvailable(): Promise<GiftCardPage>
	{	
		await this.browser.wait(this.loadCondition());
		return this;
	}

	public loadCondition(): WaitCondition {
		return urlContainsValue(this.browser, "Gift-Cards");
	}

	public async selectCardAmount(amount:number): Promise<void> {
		const options = await this.amountOptions.findElements({css:".//div"});
		for(let i = 0; i< options.length; i++){
			const optionText = await (await options[i].getText()).replace("$","");
			if(optionText.includes(amount.toString())){
				options[i].click();
				return;
			}
		}
	}

	public selectCardStyleSet(styleSet:GiftCardStyleSets): Promise<void>{
		const cardStyleSet = this.cardStyleSets.findElement({id:styleSet});
		return cardStyleSet.click();
	}

	public async getCards(styleSet:GiftCardStyleSets): Promise<Array<GiftCard>>{
		const replacedDashes = styleSet.replace("-","");
		const firstLetterLowercased = replacedDashes.charAt(0).toLowerCase() + replacedDashes.slice(1);
		const toBackgroundId = `${firstLetterLowercased}Background`;
		const cardStyleContainer = await this.browser.findElement({id:toBackgroundId});
		console.error("cde", await cardStyleContainer.getAttribute("className"));
		const cardElements = await cardStyleContainer.findElements({xpath:".//div"});
		const giftCards = await cardElements.map((cardElement) => {
			return new GiftCard(this.browser, cardElement);
		});
		return giftCards;
	}
}