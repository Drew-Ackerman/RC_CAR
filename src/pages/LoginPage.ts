import { Browser, elementIsVisible, findByCSS, findById, WaitCondition } from "../lib";
import { TextInput, WebComponent, Button } from "../lib/elements";
import { Page } from "../components/page";

/**
 * @classdesc POM for the Login page.
 */
export class LoginPage extends Page{

	@findById("j_password")
	private PasswordInput : TextInput;

	@findById("j_username")
	private UsernameInput : TextInput;

	@findById("login")
	private LoginForm : WebComponent;

	@findById("signInButton")
	private SignInButton : Button;

	@findById("setupNewAccountButton")
	private SetupNewAccountBtn : WebComponent;

	constructor(browser: Browser){
		super(browser);
	}

	/**
	 * Login by filling out the form and submitting it. 
	 * @param username The username to use
	 * @param password The password to use
	 * Successful login changes page to account home page.
	 */
	public async Login(username:string, password:string): Promise<void>{
		await this.UsernameInput.type(username);
		await this.PasswordInput.type(password);
		await this.SignInButton.click();
	}

	/**
	 * We know the LoginPage is visible when the LoginForm is visible.
	 * @returns A promise
	 */
	public loadCondition(): WaitCondition {
		return elementIsVisible(() => this.LoginForm);
	}

	/**
	 * Click the setup new account button
	 * Page should change to AccountHelpPage
	 */
	public async setupNewAccount(): Promise<void> {
		await this.SetupNewAccountBtn.click();
	}
}