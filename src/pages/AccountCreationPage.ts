import { WebElement } from "selenium-webdriver";
import { Page, WaitCondition, Browser, urlContainsValue, findByName, TextInput, findById, findByCSS, Button, pageHasLoaded } from "../lib";
import { ViewPersonalProfile } from "./ViewPersonalProfile";

export class AccountCreationPage extends Page {
    
    private async FindSubscribeCheckbox(browser:Browser): Promise<WebElement>{
        let checkbox = await browser.findElement({css:"input[name='onEmailList']"});
        let id = await checkbox.getAttribute('id');
        let label = await browser.findElement({css:`label[for='${id}']`});
        return label;
    }

    private async Find2FactorCheckbox(browser:Browser): Promise<WebElement>{
        let checkbox = await browser.findElement({css:"input[name='2FactorOff']"});
        let id = await checkbox.getAttribute('id');
        let label = await browser.findElement({css:`label[for='${id}']`});
        return label;
    }

    @findByName('email')
    public EmailAddressInput : TextInput;

    @findById('newPassword')
    public NewPasswordInput : TextInput;

    @findById('newPassword2')
    public NewPassword2Input : TextInput;

    @findByName('answer1')
    public AnswerInput : TextInput;

    @findByName('answer2')
    public Answer2Input : TextInput;

    @findByCSS("button[type='submit']")
    public SubmitButton : Button;

    constructor (browser : Browser){
        super(browser);
    }
    
    /**
     * Fill out the form to create a new account.
     * @param email 
     * @param password 
     * @param answer 
     * @returns The personal profile page that should appear upon successful account creation
     */
    public async CreateNewAccount(email:string, password:string, answer:string): Promise<ViewPersonalProfile>{
        await this.EmailAddressInput.type(email);
        await this.NewPasswordInput.type(password);
        await this.NewPassword2Input.type(password);
        await this.AnswerInput.type(answer);
        await this.Answer2Input.type(answer);

        await (this.browser.findElement(this.FindSubscribeCheckbox).click());
        await (this.browser.findElement(this.Find2FactorCheckbox).click());
    
        await this.SubmitButton.click();
        await this.browser.wait(pageHasLoaded(ViewPersonalProfile));
        return new ViewPersonalProfile(this.browser);
    }

    /**
     * The page is laoded when the url contains certain text
     * @returns wait condition
     */
    public loadCondition(): WaitCondition {
        return urlContainsValue(this.browser, 'Create-Account-Action');
    }
    
}