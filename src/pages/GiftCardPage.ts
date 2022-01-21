import { WebElement } from "selenium-webdriver";
import { findById, urlContainsValue, WaitCondition, WebComponent, Button } from "../lib";
import { Page } from "../components/page";
import { IBrowser } from "../interfaces/IBrowser";

/**
 * A collection of applicable gift card style sets.
 * A style set contains multiple styles of related giftcards.
 */
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

	/**
	 * Add this giftcard to the shopping cart.
	 */
	public async addToCart(): Promise<void> {
		await this.element.click();
		await this.addToCartBtn.click();
	}
}

/**
 * The POM for the gift card page.
 */
export class GiftCardPage extends Page {

	@findById("amountOption")
	private amountOptions: WebComponent;

	@findById("cardStyleSet")
	private cardStyleSets: WebComponent;

	constructor(browser:IBrowser){
		super(browser);
	}

	public loadCondition(): WaitCondition {
		return urlContainsValue(this.browser, "Gift-Cards");
	}

	/**
	 * Select a balance for the gift card 
	 * @param amount The balance wanted
	 * @returns The wanted amount if found
	 * @throws An error if the wanted {@link amount} could not be found on the page
	 */
	public async selectCardAmount(amount:number): Promise<number> {
		const options = await this.amountOptions.findElements({css:".//div"});
		for(const option of options){
			const optionText = await (await option.getText()).replace("$","");
			if(optionText.includes(amount.toString())){
				option.click();
				return Number(optionText);
			}
		}
		throw new Error(`Couldnt find an amount of ${amount}`);
	}

	/**
	 * Select a style set on the page. A style set is something like a birthday, or holiday. 
	 * @param styleSet The {@link GiftCardStyleSets} to chose on the page
	 */
	public async selectCardStyleSet(styleSet:GiftCardStyleSets): Promise<void>{
		const cardStyleSet = await this.cardStyleSets.findElement({id:styleSet});
		return cardStyleSet.click();
	}

	/**
	 * Ensure selectCardStyleSet is called first.
	 * Get a list of giftcards pertaining to the previously selected card style set.
	 * @param styleSet The style set to get cards from
	 * @returns A collection of gift cards.
	 */
	public async getCards(styleSet:GiftCardStyleSets): Promise<Array<GiftCard>>{
		const replacedDashes = styleSet.replace("-","");
		const firstLetterLowercased = replacedDashes.charAt(0).toLowerCase() + replacedDashes.slice(1);
		const toBackgroundId = `${firstLetterLowercased}Background`;
		const cardStyleContainer = await this.browser.findElement({id:toBackgroundId});
		const cardElements = await cardStyleContainer.findElements({xpath:".//div"});
		const giftCards = await cardElements.map((cardElement) => {
			return new GiftCard(this.browser, cardElement);
		});
		return giftCards;
	}
}