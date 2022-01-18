import { WaitCondition, urlContainsValue, TextInput, findById, findByCSS, Button, Checkbox } from "../lib";
import { Page } from "../components/page";
import { IBrowser } from "../interfaces/IBrowser";

export class AccountCreationPage extends Page {
	
	@findByCSS("label[for='subscribeCheckbox']")
	private subscribeCheckbox : Checkbox;

	@findByCSS("label[for='twoFactorCheckbox']")
	private twoFactorCheckbox : Checkbox;

	@findById("email")
	private emailAddressInput : TextInput;

	@findById("newPassword")
	private newPasswordInput : TextInput;

	@findById("newPassword2")
	private newPassword2Input : TextInput;

	@findById("answer1")
	private answerInput : TextInput;

	@findById("answer2")
	private answer2Input : TextInput;

	@findById("accountCreationSubmitButton")
	private submitButton : Button;

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
	public async createNewAccount(email:string, password:string, answer:string){
		await this.emailAddressInput.clearAndType(email);
		await this.newPasswordInput.clearAndType(password);
		await this.newPassword2Input.clearAndType(password);
		await this.answerInput.clearAndType(answer);
		await this.answer2Input.clearAndType(answer);

		await this.subscribeCheckbox.uncheck();
		await this.twoFactorCheckbox.check();
	
		await this.submitButton.click();
	}

	/**
	 * The page is laoded when the url contains certain text
	 * @returns wait condition
	 */
	public loadCondition(): WaitCondition {
		return urlContainsValue(this.browser, "Create-Account-Action");
	}
	
}