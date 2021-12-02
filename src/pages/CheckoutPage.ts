import { WebElement } from "selenium-webdriver";
import { Browser, Button, elementIsPresent, elementIsVisible, findByCSS, findById, Page, Selector, TextInput, urlContainsValue, WaitCondition, WebComponent } from "../lib";

export const enum States {
    California = 'California',
    Idaho = 'Idaho',
    Nevada = 'Navada',
    Utah = 'Utah',
}

export const enum Stores {
    UtahWarehouse = 'Utah Warehouse',
    Layton = 'Layton',
}

/**
 * @description The delivery choices available during checkout
 */
export const enum DeliveryChoices {
    InStore,
    Delivery
}

/**
 * @description The account types available during checkout
 */
export const enum AccountTypes {
    Account,
    Guest
}

/**
 * @description The shipping options available for when delivery is done.
 */
export const enum ShippingOptions {
    FreeCurbside,
    InHome,
    InHomeAndBlueRewards
}

type Address = {
    firstName: string,
    lastName: string,
    streetAddress: string,
    streetAddress2: string | undefined,
    city: string,
    state: string,
    zip: string,
}


/**
 * @class POM for checkout
 */
export class CheckoutPage extends Page {


    private async findContactInformationContinueButton(browser:Browser): Promise<WebElement>{
        var contactInfoForms = await browser.findElements({css:"form[action='/Order-Confirm']"});
        for(let i=0; i < contactInfoForms.length; i++){
            let contactInfoForm = contactInfoForms[i];
            if(await contactInfoForm.isDisplayed()){
                var continueButton = contactInfoForm.findElement({css:"button"});
                return continueButton;
            }
        }
        throw new Error('Couldnt find a visible continue button');
    }

    @findByCSS("a[href='#loginForm']")
    public AccountLoginButton: Button;

    @findById('continueAsGuest')
    public GuestLoginButton: Button;

    @findById('states')
    public StateSelector: Selector;

    @findById('locationId')
    public StoreSelector: Selector;

    @findById('deliveryContinueButton')
    private DeliveryContinueButton: Button;

    @findById('shippingFirstName')
    public FirstNameField: TextInput;

    @findById('shippingLastName')
    public LastNameField: TextInput;

    @findById('shippingAddress1')
    private ShippingAddress1Field: TextInput;

    @findById('shippingAddress2')
    private ShippingAddress2Field: TextInput;

    @findById('shippingCity')
    private ShippingCity: TextInput;

    @findById('shippingState')
    private ShippingState: TextInput;

    @findById('shippingZipCode')
    private ShippingZip: TextInput;

    @findByCSS("img[alt='Free Curbside Delivery']")
    private FreeCurbsideDelivery: Button;

    @findById('deliveryContinueButton')
    private ShippingConfirmButton: Button;

    @findByCSS("input[name='contactEmail']")
    private EmailInput: TextInput;

    @findById('homePhone')
    private HomePhoneInput: TextInput;

    @findById('mobilePhone')
    private MobilePhoneInput: TextInput;

    @findById('workPhone')
    private WorkPhoneInput: TextInput;

    @findById('CARD0')
    private CreditCardPaymentSelection: WebComponent;

    @findById('PAPY0')
    private PayPalPaymentSelection: WebComponent;

    @findByCSS("label[for='sameAddress']")
    private SameAddressCheck: WebComponent;

    @findById('continuePaymentButton')
    public ContinuePaymentButton: Button;

    @findById('finalSubmit')
    public PlaceOrderButton: Button;

    @findById('backToCart')
    private BackToCartButton: Button;

    constructor(public browser:Browser){
        super(browser);
    }
    
    public loadCondition(): WaitCondition {
        return urlContainsValue(this.browser, 'Proceed-To-Checkout');
    }

    /**
     * Complete the account selection section.
     * @param accountType 
     */
    public async selectAccountType(accountType: AccountTypes){
        var loginButtonDiv = new WebComponent(this.browser.findElement({css:"div[class~='login-buttons']"}), "div[class~='login-buttons']");
        await this.browser.wait(elementIsPresent(()=>loginButtonDiv));

        if(accountType == AccountTypes.Account){
            await this.AccountLoginButton.click();
        }
        else{
            var guestButton = await loginButtonDiv.findElement({css:"button[type='button']"});
            //await this.browser.wait(elementIsVisible(()=>guestButton));
            await guestButton.click();
        }
    }

    /**
     * Fillout delivery
     * @param deliveryOption The delivery option
     * @param shippingOption The shipping option
     */
    public async selectDelivery(shippingOption: ShippingOptions){
        //Default radio button, dont need to click it.
        //Fill out address then.
        await this.browser.wait(elementIsVisible(()=>this.FirstNameField));
        await this.FirstNameField.type('Demo');
        await this.LastNameField.type('Demo');
        await this.ShippingAddress1Field.type('DemoStreet');
        await this.ShippingCity.type('Demo');
        await this.ShippingState.type('UT');
        await this.ShippingZip.type('84405');

        if(shippingOption == ShippingOptions.FreeCurbside){
            await this.browser.wait(elementIsVisible(()=>this.FreeCurbsideDelivery));
            await this.FreeCurbsideDelivery.click();
        }
        await this.DeliveryContinueButton.click();
    }

    public async selectInStorePickup(state: States, store: Stores){
        await this.StateSelector.selectOption('Utah');
    }

    /**
     * Fillout the contact info
     * @param email 
     * @param phone 
     */
    public async enterContactInfo(email:string, phone:string){
        await this.browser.wait(elementIsVisible(()=>this.EmailInput));
        await this.EmailInput.type(email);
        await this.HomePhoneInput.type(phone);
        await this.MobilePhoneInput.type(phone);
        await this.WorkPhoneInput.type(phone);
        let continueButton = new Button(this.browser.findElement(this.findContactInformationContinueButton), 'function');
        await this.browser.wait(elementIsVisible(() => continueButton));
        await continueButton.click();
    }

    /**
     * Fillout the payment details section. 
     * @param ccNumber 
     * @param cardExp 
     * @param csc 
     */
    public async enterPaymentDetails(ccNumber:string, cardExp:string, csc:string){
        await this.browser.sleep(2);
        let rootwindow = await this.browser.CurrentWindowHandle;
        console.log(rootwindow);
        await (await this.browser.switchTo()).frame(2);
        let cci = await this.browser.findElement({css:"input[name~='cardnumber']"});
        await cci.sendKeys(ccNumber);  
        await (await this.browser.switchTo()).parentFrame();
        await (await this.browser.switchTo()).frame(2);
        let ccexp = await this.browser.findElement({css:"input[name~='exp-date']"});
        await ccexp.sendKeys(cardExp);
        await (await this.browser.switchTo()).parentFrame();
        await (await this.browser.switchTo()).frame(3);
        let cscinput = await this.browser.findElement({css:"input[name~='cvc']"})
        await cscinput.sendKeys(csc);
        await (await this.browser.switchTo()).parentFrame();
    }

    public selectSameBillingAddress(): Promise<void>{
        return this.SameAddressCheck.click();
    }

    public async submitPaymentInformation(){
        await this.browser.wait(elementIsVisible(()=>this.ContinuePaymentButton));
        return this.ContinuePaymentButton.click();

    }

    public async placeOrder(){
        await this.browser.wait(elementIsVisible(()=>this.PlaceOrderButton));
        return this.PlaceOrderButton.click();
    }
 

}