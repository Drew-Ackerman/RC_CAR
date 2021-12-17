import { Page } from "../components/page";
import { Browser, Button, Checkbox, findByCSS, findById, pageHasLoaded, TextInput, urlContainsValue, WaitCondition } from "../lib";
import { AccountHomePage } from "./AccountHomePage";

export class AccountSecurityPage extends Page{

	@findById("email")
	private newEmailInput: TextInput;

	@findById("changeEmailBtn")
	private changeEmailButton: Button;

	@findById("oldPassword")
	private oldPasswordInput: TextInput;

	@findById("newPassword")
	private newPasswordInput: TextInput;	

	@findById("newPassword2")
	private confirmPasswordInput: TextInput;

	@findById("changePasswordBtn")
	private changePasswordButton: Button;

	@findByCSS("label[for='2FactorOff']")
	private twoFactorAuthentictionCheckbox: Checkbox;

	constructor(browser:Browser){
		super(browser);
	}

	/**
	 * Change the users email. The changed email is what they then login with. 
	 * @param newEmail 
	 * @returns 
	 */
	public async changeEmail(newEmail:string): Promise<AccountHomePage>{
		await this.newEmailInput.clear();
		await this.newEmailInput.type(newEmail);
		await this.changeEmailButton.click();
		await this.browser.wait(pageHasLoaded(AccountHomePage));
		return new AccountHomePage(this.browser);
	}

	/**
	 * Change the users password to a new one. 
	 * @param oldPassword 
	 * @param newPassword 
	 * @returns 
	 */
	public async changePassword(oldPassword:string, newPassword:string){
		await this.newPasswordInput.type(newPassword);
		await this.confirmPasswordInput.type(newPassword);
		//await this.oldPasswordInput.type(oldPassword);
		await this.changePasswordButton.click();
		await this.browser.wait(pageHasLoaded(AccountHomePage));
		return new AccountHomePage(this.browser);
	}

	/**
	 * Turn two factor authentication for the user on and off
	 * @param check True->On, False->Off. 
	 * @returns 
	 */
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