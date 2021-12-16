import { Browser, elementIsNotVisible, findByClass, WebComponent } from "../lib";

export class InformationPopup {

    @findByClass("md-overlay md-active")
    private overlay: WebComponent;

    @findByClass("overlay-close")
    private closeButton: WebComponent;

    constructor(protected browser:Browser){

    }

    public async waitTillNotPresent(){
        return this.browser.wait(elementIsNotVisible(()=>this.overlay));
    }

    public async close(){
        return this.closeButton.click();
    }
}