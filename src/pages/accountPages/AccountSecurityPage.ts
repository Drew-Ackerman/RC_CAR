import { Browser, Button, Checkbox, findByCSS, findById, Page, pageHasLoaded, TextInput, urlContainsValue, WaitCondition } from "../../lib";
import { AccountHomePage } from "../AccountHomePage";


export class AccountSecurityPage extends Page{

	@findById("email")
	private newEmailInput: TextInput;

	@findById("changeEmailBtn")
	private changeEmailButton: Button;

	@findById("oldPassword")
	private oldPasswordInput: TextInput;

	@findById("newPassword")
	private newPasswordInput: TextInput;	

	@findById("changePasswordBtn")
	private changePasswordButton: Button;

	@findByCSS("label[for='2FactorOff']")
	private twoFactorAuthentictionCheckbox: Checkbox;

	constructor(browser:Browser){
		super(browser);
	}

	public async changeEmail(email:string): Promise<AccountHomePage>{
		await this.newEmailInput.type(email);
		await this.changeEmailButton.click();
		await this.browser.wait(pageHasLoaded(AccountHomePage));
		return new AccountHomePage(this.browser);
	}

	public async changePassword(oldPassword:string, newPassword:string){
		await this.oldPasswordInput.type(oldPassword);
		await this.newPasswordInput.type(newPassword);
		await this.changePasswordButton.click();
		await this.browser.wait(pageHasLoaded(AccountHomePage));
		return new AccountHomePage(this.browser);
	}

	public async twoFactorAuthentication(check:boolean){
		if(check){
			await this.twoFactorAuthentictionCheckbox.check();
		}
		else{
			await this.twoFactorAuthentictionCheckbox.uncheck();
		}
		await this.browser.wait(pageHasLoaded(AccountHomePage));
		return new AccountHomePage(this.browser);
	}
	
	public loadCondition(): WaitCondition {
		return urlContainsValue(this.browser, "View-Customer-Security");
	}
}