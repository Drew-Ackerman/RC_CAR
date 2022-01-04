import { Browser, elementIsNotVisible, findByClass, WebComponent } from "../lib";

export class InformationPopup {

    @findByClass("md-overlay md-active")
    private overlay: WebComponent;

    @findByClass("overlay-close")
    private closeButton: WebComponent;

    constructor(protected browser:Browser){

    }

    /**
     * Wait until this popup is gone. 
     * @param optionalTimeout How long to wait for the timeout, optional.
     * @returns 
     */
    public async waitTillNotPresent(optionalTimeout?:number){
        return this.browser.wait(elementIsNotVisible(()=>this.overlay), optionalTimeout);
    }

    public async close(){
        return this.closeButton.click();
    }
}