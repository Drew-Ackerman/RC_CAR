import { Browser, componentIsVisible, findById, WaitCondition } from "../lib";
import { TextInput, WebComponent, Button } from "../lib/components";
import { Page } from "../partials/page";

/**
 * @classdesc POM for the Login page.
 */
export class LoginPage extends Page{

	@findById("j_password")
	private passwordInput : TextInput;

	@findById("j_username")
	private usernameInput : TextInput;

	@findById("login")
	private loginForm : WebComponent;

	@findById("signInButton")
	private signInButton : Button;

	@findById("setupNewAccountButton")
	private setupNewAccountBtn : WebComponent;

	constructor(browser: Browser){
		super(browser);
	}

	/**
	 * Login by filling out the form and submitting it. 
	 * @param username The username to use
	 * @param password The password to use
	 * Successful login changes page to account home page.
	 */
	public async login(username:string, password:string): Promise<void>{
		await this.usernameInput.type(username);
		await this.passwordInput.type(password);
		await this.signInButton.click();
	}

	/**
	 * We know the LoginPage is visible when the LoginForm is visible.
	 * @returns A promise
	 */
	public loadCondition(): WaitCondition {
		return componentIsVisible(() => this.loginForm);
	}

	/**
	 * Click the setup new account button
	 * Page should change to AccountHelpPage
	 */
	public async setupNewAccount(): Promise<void> {
		await this.setupNewAccountBtn.click();
	}
}