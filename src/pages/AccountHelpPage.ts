import { Browser, findByLinkText, pageHasLoaded, urlContainsValue, WaitCondition, WebComponent } from "../lib";
import { Page } from "../lib";
import { AccountCreationPage } from "./AccountCreationPage";

export class AccountHelpPage extends Page{

    @findByLinkText('click here')
    public CreateAccountLink : WebComponent;

    constructor (browser:Browser){
        super(browser);
    }

    public async gotoAccountCreation() {
        await this.CreateAccountLink.click();
        await this.browser.wait(pageHasLoaded(AccountCreationPage))
        return new AccountCreationPage(this.browser);
    }

    public loadCondition(): WaitCondition {
        return urlContainsValue(this.browser, 'Account-Help')
    }
}