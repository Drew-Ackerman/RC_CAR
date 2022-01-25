import { Key } from "selenium-webdriver";
import { TestAddress, waitFor } from "../../config";
import { Button, componentIsVisible, findByCSS, findById, Selector, TextInput, urlContainsValue, WaitCondition, WebComponent } from "../lib";
import { Address, ContactInformation, CreditCardInformation } from "../types";
import { Page } from "../partials/page";
import { IBrowser } from "../interfaces/IBrowser";
import { DatePicker } from "../partials/DatePicker";

/**
 * @description Valid states
 */
export const enum States {
	California = "California",
	Idaho = "Idaho",
	Nevada = "Navada",
	Utah = "Utah",
}

export const enum Stores {
	UtahWarehouse = "Utah Warehouse",
	Layton = "Layton",
	SouthSaltLake = "South Salt Lake",
	Riverdale = "Riverdale",
	Draper = "Draper",
	University = "University Place Orem",
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
	InHomeAndBlueRewards,
	Any
}

export const enum PaymentMethods {
	StoreCashier,
	CreditCard,
	PayPal
}

/**
 * @class POM for checkout
 */
export class CheckoutPage extends Page {

	@findById("continueAsGuestButton")
	private containueAsGuestButton: Button;

	@findById("loginToAccountButton")
	private loginToAccountButton: WebComponent;

	@findById("giftCardEmail1")
	private giftCardEmailInput: TextInput;

	@findById("personalMessage1")
	private personalMessageInput: TextInput;

	@findById("deliveryContinueButton")
	private deliveryContinueButton: Button;

	@findById("shippingFirstName")
	private firstNameField: TextInput;

	@findById("shippingLastName")
	private lastNameField: TextInput;

	@findById("shippingAddress1")
	private shippingAddress1Field: TextInput;

	@findById("shippingAddress2")
	private shippingAddress2Field: TextInput;

	@findById("shippingCity")
	private shippingCity: TextInput;

	@findById("shippingState")
	private shippingState: TextInput;

	@findById("shippingZipCode")
	private shippingZip: TextInput;

	@findById("shippingOpts0")
	private shippingOptions: WebComponent;

	@findByCSS("img[alt='Free Curbside Delivery']")
	private freeCurbsideDelivery: Button;

	@findByCSS("label[for='shipRCW0']")
	private inHomeDeliveryBtn: Button;

	@findByCSS("label[for='shipBRO'")
	private inHomeBlueRewardsDeliveryBtn: Button;

	@findById("deliveryContinueButton")
	private shippingConfirmButton: Button;

	@findByCSS("input[name='contactEmail']")
	private emailInput: TextInput;

	@findById("homePhone")
	private homePhoneInput: TextInput;

	@findById("mobilePhone")
	private mobilePhoneInput: TextInput;

	@findById("workPhone")
	private workPhoneInput: TextInput;

	@findById("paymentMethod0")
	private creditCardPaymentContainer: WebComponent;

	@findById("CARD0")
	private creditCardPaymentSelection: WebComponent;

	@findById("PAPY0")
	private payPalPaymentSelection: WebComponent;

	@findByCSS("label[for='sameAddress']")
	private sameAddressCheck: WebComponent;

	@findById("txtBillFirstName")
	private billingFirstName: TextInput;

	@findById("txtBillLastName")
	private billingLastName: TextInput;

	@findById("txtBillStreet1")
	private billingStreet1: TextInput;

	@findById("txtBillStreet2")
	private billingStreet2: TextInput;

	@findById("txtBillCity")
	private billingCity: TextInput;

	@findById("txtBillState")
	private billingState: TextInput;

	@findById("txtBillPostal")
	private billingZip: TextInput;

	@findById("continuePaymentButton")
	private continuePaymentButton: Button;

	@findById("finalSubmit")
	private placeOrderButton: Button;

	@findById("backToCart")
	private backToCartButton: Button;

	@findByCSS("label[for='inStorePickupRadio']")
	private inStorePickupOption: WebComponent;

	@findById("states")
	private stateSelector: Selector;

	@findById("loationId")
	private storeSelector: Selector;

	@findByCSS("label[for='CARD0']")
	private cardSelector: WebComponent;

	@findByCSS("label[for='PAYP0']")
	private paypalSelector: WebComponent;

	@findByCSS("label[for='storeCashier0']")
	private storeCashierSelector: WebComponent;

	@findById("ui-datepicker-div")
	private datepicker: DatePicker;

	constructor(public browser:IBrowser){
		super(browser);
	}
	
	/**
	 * Waits until part of the browser url contains 'Proceed-To-Checkout'
	 * @returns WaitCondition
	 */
	public loadCondition(): WaitCondition {
		return urlContainsValue(this.browser, "Proceed-To-Checkout");
	}

	/**
	 * Complete the account selection section.
	 * @param accountType 
	 */
	public async selectAccountType(accountType: AccountTypes){
		if(accountType == AccountTypes.Account){
			await this.browser.wait(componentIsVisible(()=>this.loginToAccountButton), waitFor.TenSeconds);
			await this.loginToAccountButton.click();
		}
		else{
			await this.browser.wait(componentIsVisible(()=>this.containueAsGuestButton));
			await this.containueAsGuestButton.click();
		}
	}

	/**
	 * Fillout delivery
	 * @param shippingInformation
	 * @param shippingOption The shipping option
	 */
	public async selectDelivery(shippingInformation=TestAddress, shippingOption: ShippingOptions){
		//Default radio button, dont need to click it.
		//Fill out address then.
		await this.browser.wait(componentIsVisible(()=>this.firstNameField),waitFor.TenSeconds);
		await this.firstNameField.clear();
		await this.firstNameField.type(shippingInformation.firstName);
		await this.lastNameField.clear();
		await this.lastNameField.type(shippingInformation.lastName);
		await this.shippingAddress1Field.clear();
		await this.shippingAddress1Field.type(shippingInformation.streetAddress);
		await this.shippingAddress2Field.clear();
		await this.shippingAddress2Field.type(shippingInformation.streetAddress2);
		await this.shippingCity.clear();
		await this.shippingCity.type(shippingInformation.city);
		await this.shippingState.clear();
		await this.shippingState.type(shippingInformation.state);
		await this.shippingZip.clear();
		await this.shippingZip.type(shippingInformation.zip, Key.ENTER);

		await this.browser.sleep(5);
		await this.browser.wait(componentIsVisible(()=>this.shippingOptions), waitFor.TenSeconds, "No options available");
		const firstDeliveryOption = new WebComponent(this.browser.findElement({className:"shippingOptions"}), "shippingOptions");

		switch(shippingOption){
		case ShippingOptions.Any:
			await firstDeliveryOption.click();
			break;
		case ShippingOptions.InHome:
			await this.browser.wait(componentIsVisible(()=>this.inHomeDeliveryBtn), waitFor.TenSeconds, "No in home ship option");
			await this.inHomeDeliveryBtn.click();
			break;
		case ShippingOptions.InHomeAndBlueRewards:
			await this.browser.wait(componentIsVisible(()=>this.inHomeBlueRewardsDeliveryBtn), waitFor.TenSeconds, "No in home blue rewards ship option");
			await this.inHomeBlueRewardsDeliveryBtn.click();
			break;
		case ShippingOptions.FreeCurbside:
			await this.browser.wait(componentIsVisible(()=>this.freeCurbsideDelivery), waitFor.TenSeconds, "No curbside ship option");
			await this.freeCurbsideDelivery.click();
			break;
		}

		await this.deliveryContinueButton.click();
	}
	
	public async selectInStorePickup(state?:States, store?:Stores){
		await this.browser.wait(componentIsVisible(()=>this.inStorePickupOption));
		await this.inStorePickupOption.click();
		if(state){
			await this.stateSelector.selectOptionByText(state);
		}
		if(store){
			await this.storeSelector.selectOptionByText(store);
		}
		await this.browser.wait(componentIsVisible(() => this.deliveryContinueButton));
		await this.deliveryContinueButton.click();
	}

	public async enterBillingDetails(address:Address){
		await this.billingFirstName.clear();
		await this.billingFirstName.type(address.firstName);
		await this.billingLastName.clear();
		await this.billingLastName.type(address.lastName);
		await this.billingStreet1.clear();
		await this.billingStreet1.type(address.streetAddress);
		await this.billingStreet2.clear();
		await this.billingStreet2.type(address.streetAddress2);
		await this.billingCity.clear();
		await this.billingCity.type(address.city);
		await this.billingState.clear();
		await this.billingState.type(address.state);
		await this.billingZip.clear();
		await this.billingZip.type(address.zip);
	}

	/**
	 * Fillout the contact info
	 * @param email 
	 * @param phone 
	 */
	public async enterContactInfo(contactInformation:ContactInformation){
		await this.browser.wait(componentIsVisible(()=>this.emailInput));
		await this.emailInput.clear();
		await this.emailInput.type(contactInformation.email);
		await this.homePhoneInput.clear();
		await this.homePhoneInput.type(contactInformation.homePhone);
		await this.mobilePhoneInput.clear();
		await this.mobilePhoneInput.type(contactInformation.mobilePhone);
		await this.workPhoneInput.clear();
		await this.workPhoneInput.type(contactInformation.workPhone);
		const continueButton = new Button(this.browser.findElement({id:"contactInfoContinueButton"}), "id:contactInfoContinueButton");
		await this.browser.wait(componentIsVisible(() => continueButton));
		await continueButton.click();
	}

	/**
	 * Fillout the payment details section. 
	 * @param ccNumber 
	 * @param cardExp 
	 * @param csc 
	 */
	public async enterPaymentDetails(creditCardInfo:CreditCardInformation){
		await this.browser.sleep(2);
		await this.browser.wait(componentIsVisible(() => this.creditCardPaymentContainer), waitFor.TenSeconds, "Couldnt find credit card payment container");
		//Find the cc input frame and type in it.
		await (await this.browser.switchTo()).defaultContent();
		const ccinputcont = await this.browser.findElement({id:"creditCard"});
		const ccframe = await ccinputcont.findElement({xpath:".//iframe"});
		await (await this.browser.switchTo()).frame(ccframe);
		const cci = await this.browser.findElement({css:"input[name~='cardnumber']"});
		await cci.sendKeys(creditCardInfo.creditCardNumber);  

		//Find the cc expiration frame and type in it.
		await (await this.browser.switchTo()).defaultContent();
		const ccExp = await this.browser.findElement({id:"cardExpiry"});
		const ccExpFrame = await ccExp.findElement({xpath:".//iframe"});
		await (await this.browser.switchTo()).frame(ccExpFrame);
		const ccexp = await this.browser.findElement({css:"input[name~='exp-date']"});
		await ccexp.sendKeys(creditCardInfo.creditCardExp);

		//Find the cc csv frame and type in it
		await (await this.browser.switchTo()).defaultContent();
		const ccCsv = await this.browser.findElement({id:"cardCode"});
		const ccCsvFrame = await ccCsv.findElement({xpath:".//iframe"});
		await (await this.browser.switchTo()).frame(ccCsvFrame);
		const cscinput = await this.browser.findElement({css:"input[name~='cvc']"});
		await cscinput.sendKeys(creditCardInfo.creditCardCSV);

		await (await this.browser.switchTo()).parentFrame();
	}

	public async selectPaymentMethod(paymentMethod:PaymentMethods){
		//const paymentMethodContainer = await this.browser.findElement({id:"paymentMethod0"});
		
		switch(paymentMethod){
		case PaymentMethods.CreditCard:
			await this.browser.wait(componentIsVisible(()=>this.cardSelector));
			await this.cardSelector.click();
			break;
		case PaymentMethods.PayPal:
			await this.browser.wait(componentIsVisible(()=>this.paypalSelector));
			await this.paypalSelector.click();
			break;
		case PaymentMethods.StoreCashier:
			await this.browser.wait(componentIsVisible(()=>this.storeCashierSelector));
			await this.storeCashierSelector.click();
			break;
		}
	}

	/**
	 * Enter the information needed to delivery a giftcard by email.
	 * @param email Email to send gift card to
	 * @param personalMessage A personalized message to put into the email
	 */
	public async enterGiftCardDeliveryOptions(email: string, personalMessage: string){
		await this.browser.sleep(2);
		await this.browser.wait(componentIsVisible(() => this.giftCardEmailInput), waitFor.TenSeconds);
		await this.giftCardEmailInput.type(email);
		await this.browser.wait(componentIsVisible(() => this.personalMessageInput), waitFor.TenSeconds);
		await this.personalMessageInput.type(personalMessage);
		await this.browser.wait(componentIsVisible(() => this.deliveryContinueButton), waitFor.TenSeconds);
		await this.deliveryContinueButton.click();
	}

	/**
	 * Select the sameBillingAddress checkbox.
	 * @returns 
	 */
	public selectSameBillingAddress(): Promise<void>{
		return this.sameAddressCheck.click();
	}

	/**
	 * Wait until the button for this section is visible
	 * then click it. 
	 * @returns 
	 */
	public async submitPaymentInformation(): Promise<void> {
		await this.browser.wait(componentIsVisible(()=>this.continuePaymentButton));
		return this.continuePaymentButton.click();
	}

	/**
	 * Finish the checkout process.
	 * @returns 
	 */
	public async placeOrder(): Promise<void> {
		await this.browser.wait(componentIsVisible(()=>this.placeOrderButton));
		return this.placeOrderButton.click();
	}
}