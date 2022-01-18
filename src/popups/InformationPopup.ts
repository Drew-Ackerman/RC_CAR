import { IBrowser } from "../interfaces/IBrowser";
import { elementIsNotVisible, elementIsVisible, findByClass, findById, WebComponent } from "../lib";

export class InformationPopup {

	@findById("modalId")
	private overlay: WebComponent;

	@findByClass("overlay-close")
	private closeButton: WebComponent;

	constructor(protected browser: IBrowser){

	}

	public async appearsAndLeaves(optionalTimeout?:number){
		await this.browser.wait(elementIsVisible(()=>this.overlay), optionalTimeout, `Information popup did not appear within ${optionalTimeout} seconds`);
		await this.browser.wait(elementIsNotVisible(()=>this.overlay), optionalTimeout, `Information popup did not leave within ${optionalTimeout} seconds`);
		return;
	}

	/**
	 * Wait until this popup is gone. 
	 * @param optionalTimeout How long to wait for the timeout, optional.
	 * @returns 
	 */
	public async waitTillNotPresent(optionalTimeout?:number){
		return this.browser.wait(elementIsNotVisible(()=>this.overlay), optionalTimeout, `Information popup did not leave within ${optionalTimeout} seconds`);
	}

	public async getMessage(){
		await this.browser.wait(elementIsVisible(() => this.overlay), 10000);
		return this.overlay.getText();
	}

	public async close(){
		return this.closeButton.click();
	}
}