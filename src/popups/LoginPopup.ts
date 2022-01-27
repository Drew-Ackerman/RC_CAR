import { IBrowser } from "../interfaces/IBrowser";
import { componentIsNotVisible, componentIsVisible, findByClass, findById, WebComponent } from "../lib";
import { InformationPopup } from "./InformationPopup";

/**
 * For working with the the login popup.
 */
export class LoginPopup {

	@findById("modalId")
	private overlay: WebComponent;

	@findByClass("overlay-close")
	private closeButton: WebComponent;

	private informationPopup: InformationPopup;
	constructor(protected browser: IBrowser){
		this.informationPopup = new InformationPopup(browser);
	}

	/**
	 * Login to an account.
	 * @param username 
	 * @param password 
	 */
	public async login(username:string, password:string){
		await (await this.browser.switchTo()).defaultContent();
		const loginFrame = await this.overlay.findElement({css:"iframe[name='breakout']"});
		await (await this.browser.switchTo()).frame(loginFrame);
		const userNameInput = await this.overlay.findElement({id:"j_username"});
		await userNameInput.sendKeys(username);
		const passwordInput = await this.overlay.findElement({id:"j_password"});
		await passwordInput.sendKeys(password);
		const submitButton = await this.overlay.findElement({id:"signInButton"});
		await submitButton.click();
		await this.informationPopup.appearsAndLeaves();
	}

	/**
	 * Wait until this popup is gone. 
	 * @param optionalTimeout How long to wait for the timeout, optional.
	 */
	public async waitTillNotPresent(optionalTimeout?:number): Promise<void>{
		return this.browser.wait(componentIsNotVisible(()=>this.overlay), optionalTimeout, `Information popup did not leave within ${optionalTimeout} seconds`);
	}

	/**
	 * Wait for the popup to appear
	 * @param optionalTimeout How long to wait
	 */
	public async waitTillPresent(optionalTimeout?:number): Promise<void>{
		return this.browser.wait(componentIsVisible(()=>this.overlay), optionalTimeout, `Information popup did not appear within ${optionalTimeout} seconds`);
	}

	/**
	 * Close the popup if able to.
	 */
	public async close(): Promise<void>{
		return this.closeButton.click();
	}
}