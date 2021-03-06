import { IBrowser } from "../interfaces/IBrowser";
import { Button, Checkbox, findByCSS, findById, TextInput, urlContainsValue, WaitCondition } from "../lib";
import { IPage } from "../interfaces/IPage";
import { IHeader } from "../interfaces/IHeader";

export class AccountSecurityPage implements IPage{

	@findById("email")
	private newEmailInput: TextInput;

	@findById("changeEmailBtn")
	private changeEmailButton: Button;

	@findById("newPassword")
	private newPasswordInput: TextInput;	

	@findById("newPassword2")
	private confirmPasswordInput: TextInput;

	@findById("changePasswordBtn")
	private changePasswordButton: Button;

	@findByCSS("label[for='2FactorOff']")
	private twoFactorAuthentictionCheckbox: Checkbox;

	header: IHeader;
	constructor(private browser: IBrowser){	}

	navigate(): Promise<void> {
		throw new Error("Method not implemented.");
	}
	setUrl(url: string): void {
		throw new Error("Method not implemented.");
	}

	/**
	 * Change the users email. The changed email is what they then login with. 
	 * @param newEmail 
	 */
	public async changeEmail(newEmail:string): Promise<void>{
		await this.newEmailInput.clear();
		await this.newEmailInput.type(newEmail);
		await this.changeEmailButton.click();
	}

	/**
	 * Change the users password to a new one. 
	 * @param newPassword 
	 */
	public async changePassword(newPassword:string){
		await this.newPasswordInput.type(newPassword);
		await this.confirmPasswordInput.type(newPassword);
		await this.changePasswordButton.click();
	}

	/**
	 * Turn two factor authentication for the user on and off
	 * @param check True->Check, False->Uncheck. 
	 */
	public async checkTwoFactorAuthentication(check:boolean){
		if(check){
			await this.twoFactorAuthentictionCheckbox.check();
		}
		else{
			await this.twoFactorAuthentictionCheckbox.uncheck();
		}
	}
	
	public loadCondition(): WaitCondition {
		return urlContainsValue(this.browser, "View-Customer-Security");
	}
}