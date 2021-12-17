import { Browser, elementIsVisible, findByClass, findByCSS, findById, pageHasLoaded, WaitCondition } from "../lib";
import { TextInput, WebComponent, Button } from "../lib/elements";
import { AccountHelpPage } from "./AccountHelpPage";
import { Page } from "../components/page";
import { AccountHomePage } from "./AccountHomePage";

export const LoginPageUrl = "https://www.rcwilley.com/account/Home";

/**
 * @classdesc POM for the Login page.
 */
export class LoginPage extends Page{

	@findByClass("buttonGroupCenter")
	public SignInGroup : TextInput;

	@findById("j_password")
	public PasswordInput : TextInput;

	@findById("j_username")
	public UsernameInput : TextInput;

	@findById("login")
	public LoginForm : WebComponent;

	@findByCSS("button[type='submit']")
	public SignInButton : Button;

	@findByCSS("a[href='/Account-Help']")
	public SetupNewAccountBtn : WebComponent;

	constructor(browser: Browser){
		super(browser);
	}

	/**
	 * Login by filling out the form and submitting it. 
	 * @param username The username to use
	 * @param password The password to use
	 */
	public async Login(username:string, password:string): Promise<AccountHomePage>{
		await this.UsernameInput.type(username);
		await this.PasswordInput.type(password);
		await this.SignInButton.click();
		await this.browser.wait(pageHasLoaded(AccountHomePage));
		return new AccountHomePage(this.browser);
	}

	/**
	 * We know the LoginPage is visible when the LoginForm is visible.
	 * @returns A promise
	 */
	public loadCondition(): WaitCondition {
		return elementIsVisible(() => this.LoginForm);
	}

	public async setupNewAccount(): Promise<AccountHelpPage> {
		await this.SetupNewAccountBtn.click();
		await this.browser.wait(pageHasLoaded(AccountHelpPage));
		return new AccountHelpPage(this.browser);
	}
}