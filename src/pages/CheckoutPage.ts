import { Browser, Button, findByCSS, findById, Page, TextInput, urlContainsValue, WaitCondition, WebComponent } from "../lib";

export const enum DeliveryChoices {
    InStore,
    Delivery
}

export class CheckoutPage extends Page {
    
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

    @findById('sameAddress')
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

    public async continueAccount(){
        
    }

    public async selectDelivery(choice: DeliveryChoices){
        if(choice == DeliveryChoices.InStore){
            await this.DeliveryContinueButton.click();
        }
        else{ //Delivery
            
        }
    }

}