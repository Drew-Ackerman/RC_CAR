import { WebElement } from "selenium-webdriver";
import { Browser, Button, findByCSS, findById, Page, TextInput, urlContainsValue, WaitCondition, WebComponent } from "../lib";

export const enum DeliveryChoices {
    InStore,
    Delivery
}

export const enum AccountTypes {
    Account,
    Guest
}

export const enum ShippingOptions {
    FreeCurbside,
    InHome,
    InHomeAndBlueRewards
}
export class CheckoutPage extends Page {
    
    private findGuestLoginButton(browser:Browser): Promise<WebElement>{
        var loginButtons = browser.findElement({css:'login-buttons'});
        var guestButton = loginButtons.findElement({css:"button[type='button']"});
        if(guestButton){
            return guestButton;
        }
        throw Error("Could not find Continue as Guest Button on checkout page");
    }

    @findByCSS("a[href='#loginForm']")
    public AccountLoginButton: Button;

    @findById('continueAsGuest')
    public GuestLoginButton: Button;

    @findById('deliveryContinueButton')
    public DeliveryContinueButton: Button;

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

    @findById('shipCURB0')
    private FreeCurbsideDelivery: Button;

    @findById('deliveryContinueButton')
    private ShippingConfirmButton: Button;

    @findByCSS("name=['contactEmail']")
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

    @findById('creditCard')
    private CreditCardNumberInput: TextInput;

    @findById('cardExpiry')
    private CreditCardExpirationInput: TextInput;

    @findById('cardCode')
    private CardCodeInput: TextInput;

    @findByCSS("label[for='sameAddress']")
    private SameAddressCheck: WebComponent;

    @findById('continuePaymentButton')
    private ContinuePaymentButton: Button;

    @findById('finalSubmit')
    private PlaceOrderButton: Button;

    @findById('backToCart')
    private BackToCartButton: Button;

    constructor(public browser:Browser){
        super(browser);
    }
    
    public loadCondition(): WaitCondition {
        return urlContainsValue(this.browser, 'Proceed-To-Checkout');
    }

    public async selectAccountType(accountType: AccountTypes){
        if(accountType == AccountTypes.Account){
            await this.AccountLoginButton.click();
        }
        else{
            await this.browser.findElement(this.findGuestLoginButton);
        }
    }

    
    public async selectDelivery(deliveryType: DeliveryChoices, shippingOption: ShippingOptions){
        if(deliveryType == DeliveryChoices.Delivery){
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
        }
        await this.DeliveryContinueButton.click();
    }

    public async fillOutContactInfo(email:string, phone:string){
        await this.EmailInput.type(email);
        await this.HomePhoneInput.type(phone);
        await this.MobilePhoneInput.type(phone);
        await this.WorkPhoneInput.type(phone);
    }

    public async inputPaymentDetails(ccNumber:string, cardExp:string, csc:string){
        await this.CreditCardNumberInput.type(ccNumber);
        await this.CreditCardExpirationInput.type(ccNumber);
        await this.CardCodeInput.type(csc);
    }

    

}