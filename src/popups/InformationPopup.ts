import { waitFor } from "../../config";
import { IBrowser } from "../interfaces/IBrowser";
import { elementHasText, elementIsNotVisible, elementIsVisible, findByClass, findById, WebComponent } from "../lib";

/**
 * For working with the general information popups that occur after 
 * certain actions on the site; like when logging out.
 */
export class InformationPopup {

	@findById("modalId")
	private overlay: WebComponent;

	@findByClass("overlay-close")
	private closeButton: WebComponent;

	constructor(protected browser: IBrowser){	}

	/**
	 * Wait for the popup to appear, then wait for it to dissapear.
	 * @param optionalTimeout The maximum amount of time to wait.
	 */
	public async appearsAndLeaves(optionalTimeout?:number){
		await this.browser.wait(elementIsVisible(()=>this.overlay), optionalTimeout, `Information popup did not appear within ${optionalTimeout} seconds`);
		await this.browser.wait(elementIsNotVisible(()=>this.overlay), optionalTimeout, `Information popup did not leave within ${optionalTimeout} seconds`);
		return;
	}

	/**
	 * Wait for the popup to appear, display certain text, and leave
	 * @param expectedText A substring of text that should appear on the popup
	 * @param optionalTimeout How long to wait for it to appear and for it to leave
	 */
	public async displaysAndLeaves(expectedText:string, optionalTimeout?:number): Promise<void>{
		await this.browser.wait(elementIsVisible(()=>this.overlay), optionalTimeout, `Information popup did not appear within ${optionalTimeout} seconds`);
		await this.browser.wait(elementHasText(()=>this.overlay, expectedText), optionalTimeout, `Infomation popup did not contain text: ${expectedText}`);
		await this.browser.wait(elementIsNotVisible(()=>this.overlay), optionalTimeout, `Information popup did not leave within ${optionalTimeout} seconds`);
	}

	/**
	 * Wait until this popup is gone. 
	 * @param optionalTimeout How long to wait for the timeout, optional.
	 */
	public async waitTillNotPresent(optionalTimeout?:number): Promise<void>{
		return this.browser.wait(elementIsNotVisible(()=>this.overlay), optionalTimeout, `Information popup did not leave within ${optionalTimeout} seconds`);
	}

	/**
	 * Wait for the popup to appear
	 * @param optionalTimeout How long to wait
	 */
	public async waitTillPresent(optionalTimeout?:number): Promise<void>{
		return this.browser.wait(elementIsVisible(()=>this.overlay), optionalTimeout, `Information popup did not appear within ${optionalTimeout} seconds`);
	}

	/**
	 * @returns The popup's message.
	 */
	public async getMessage(): Promise<string>{
		await this.waitTillPresent(waitFor.TenSeconds);
		return this.overlay.getText();
	}

	/**
	 * Close the popup if able to.
	 */
	public async close(): Promise<void>{
		return this.closeButton.click();
	}
}