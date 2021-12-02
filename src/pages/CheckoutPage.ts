import { Key, WebElement } from "selenium-webdriver";
import { Browser, Button, elementIsVisible, findByCSS, findById, Page, Selector, TextInput, urlContainsValue, WaitCondition, WebComponent } from "../lib";

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
    
    private findGuestLoginButton(browser:Browser): Promise<WebElement>{
        var loginButtons = browser.findElement({css:"div[class~='login-buttons']"});
        var guestButton = loginButtons.findElement({css:"button[type='button']"});
        if(guestButton){
            return guestButton;
        }
        throw Error("Could not find Continue as Guest Button on checkout page");
    }

    private async findVisibleCCInput(browser:Browser){
        var ccinputs = await this.browser.findElements({css:"input[name~='cardnumber']"});
        for(let i=0; i < ccinputs.length; i++){
            let ccinput = ccinputs[i];
            let isVisible = await ccinput.isDisplayed();
            if(isVisible){
                return ccinput;
            }
        }
        throw new Error('Couldnt find a visible cc input');
    }
    private async findContactInformationContinueButton(browser:Browser): Promise<WebElement>{
        var contactInfoForms = await browser.findElements({css:"form[action='/Order-Confirm']"});
        for(let i=0; i < contactInfoForms.length; i++){
            let contactInfoForm = contactInfoForms[i];
            let isVisible = await contactInfoForm.isDisplayed();
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

    @findByCSS("img[alt='Free Ground Delivery']")
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

    @findById('gcNumber-1')
    private GiftCardNumInput: TextInput;

    @findById("input[name='exp-date']")
    private CreditCardExpirationInput: TextInput;

    @findById("input[name='csv']")
    private CardCodeInput: TextInput;

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
        if(accountType == AccountTypes.Account){
            await this.AccountLoginButton.click();
        }
        else{
            let guestButton = await this.browser.findElement(this.findGuestLoginButton);
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
        await this.FirstNameField.type('Demo');
        await this.LastNameField.type('Demo');
        await this.ShippingAddress1Field.type('DemoStreet');
        await this.ShippingCity.type('Demo');
        await this.ShippingState.type('UT');
        await this.ShippingZip.type('84405');

        if(shippingOption == ShippingOptions.FreeCurbside){
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
        //let ccinput = await this.findVisibleCCInput(this.browser);
        let ccframe = await this.browser.findElement({css:"iframe[title='Secure card number input frame']"});
        console.log('vis', await ccframe.isDisplayed());
        //let ccinput = new TextInput(ccframe.findElement(this.findVisibleCCInput), 'function'); 
        //await ccinput.type(ccNumber);
        
        let cci = await ccframe.findElement({css:"input[name~='cardnumber']"});
        await cci.sendKeys(ccNumber);     
        //await this.CreditCardExpirationInput.type(cardExp);
        //await this.CardCodeInput.type(csc);
    }

    public selectSameBillingAddress(): Promise<void>{
        return this.SameAddressCheck.click();
    }
 

}