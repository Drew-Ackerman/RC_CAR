import { WebElement } from "selenium-webdriver";
import { WaitCondition, urlContainsValue, findByName, TextInput, findById, findByCSS, Button, Checkbox } from "../lib";
import { Page } from "../components/page";
import { IBrowser } from "../interfaces/IBrowser";

export class AccountCreationPage extends Page {
	
	private async FindSubscribeCheckbox(browser:IBrowser): Promise<WebElement>{
		const checkbox = await browser.findElement({css:"input[name='onEmailList']"});
		const id = await checkbox.getAttribute("id");
		const label = await browser.findElement({css:`label[for='${id}']`});
		return label;
	}

	private async Find2FactorCheckbox(browser:IBrowser): Promise<WebElement>{
		const checkbox = await browser.findElement({css:"input[name='2FactorOff']"});
		const id = await checkbox.getAttribute("id");
		const label = await browser.findElement({css:`label[for='${id}']`});
		return label;
	}
	@findByCSS("label[for='subscribeCheckbox']")
	public SubscribeCheckbox : Checkbox;

	@findByCSS("label[for='twoFactorCheckbox']")
	public TwoFactorCheckbox : Checkbox;

	@findById("email")
	public EmailAddressInput : TextInput;

	@findById("newPassword")
	public NewPasswordInput : TextInput;

	@findById("newPassword2")
	public NewPassword2Input : TextInput;

	@findById("answer1")
	public AnswerInput : TextInput;

	@findById("answer2")
	public Answer2Input : TextInput;

	@findByCSS("button[type='submit']")
	public SubmitButton : Button;

	constructor (browser : IBrowser){
		super(browser);
	}
	
	/**
	 * Fill out the form to create a new account.
	 * @param email 
	 * @param password 
	 * @param answer 
	 * @returns The personal profile page that should appear upon successful account creation
	 */
	public async CreateNewAccount(email:string, password:string, answer:string){
		await this.EmailAddressInput.type(email);
		await this.NewPasswordInput.type(password);
		await this.NewPassword2Input.type(password);
		await this.AnswerInput.type(answer);
		await this.Answer2Input.type(answer);

		await this.SubscribeCheckbox.check();
		await this.TwoFactorCheckbox.check();
	
		await this.SubmitButton.click();
		//return new ViewPersonalProfile(this.browser);
	}

	/**
	 * The page is laoded when the url contains certain text
	 * @returns wait condition
	 */
	public loadCondition(): WaitCondition {
		return urlContainsValue(this.browser, "Create-Account-Action");
	}
	
}