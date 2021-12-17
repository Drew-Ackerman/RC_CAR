import { WebElement } from "selenium-webdriver";
import { Browser, findById, pageHasLoaded, urlContainsValue, WaitCondition, WebComponent, Button } from "../lib";
import { ShoppingCartPage } from "./ShoppingCartPage";
import { Page } from "../components/page";

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

	constructor(protected browser: Browser, protected element: WebElement){	}

	public async addToCart(): Promise<ShoppingCartPage> {
		console.log("ca", await this.element.getAttribute("data-style"));
		await this.element.click();
		const cart = await this.element.findElement({id:"addToCartBtn"});
		await this.addToCartBtn.click();
		await this.browser.wait(pageHasLoaded(ShoppingCartPage));
		return new ShoppingCartPage(this.browser);
	}
}

export class GiftCardPage extends Page {

	@findById("amountOption")
	private amountOptions: WebComponent;

	@findById("cardStyleSet")
	private cardStyleSets: WebComponent;

	constructor(browser:Browser){
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