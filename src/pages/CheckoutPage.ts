import { Key } from "selenium-webdriver";
import { TestAddress, waitFor } from "../../config";
import { Button, componentIsVisible, findByCSS, findById, Selector, TextInput, urlContainsValue, WaitCondition, WebComponent } from "../lib";
import { Address, ContactInformation, CreditCardInformation } from "../types";
import { Page } from "../partials/page";
import { IBrowser } from "../interfaces/IBrowser";
import { DatePicker } from "../partials/DatePicker";
import { LoginPopup } from "../popups/LoginPopup";

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

	public accountSection;
	public shippingSection;
	public contactInfoSection;
	public paymentSection;
	public orderReviewSection;

	constructor(public browser:IBrowser){
		super(browser);
		this.accountSection = new AccountSelectionSection(browser);
		this.shippingSection = new ShippingOptionSection(browser);
		this.contactInfoSection = new ContactInformationSection(browser);
		this.paymentSection = new PaymentSection(browser);
		this.orderReviewSection = new ReviewOrderSection(browser);	
	}
	
	/**
	 * Waits until part of the browser url contains 'Proceed-To-Checkout'
	 * @returns WaitCondition
	 */
	public loadCondition(): WaitCondition {
		return urlContainsValue(this.browser, "Proceed-To-Checkout");
	}
}

class AccountSelectionSection {

	@findById("continueAsGuestButton")
	private containueAsGuestButton: Button;

	@findById("loginToAccountButton")
	private loginToAccountButton: WebComponent;

	private loginPopup;
	constructor(private browser: IBrowser){
		this.loginPopup = new LoginPopup(browser);
	}

	/**
	 * If not logged into an account, will log into an account for the checkout process.
	 */
	public async continueWithAccount(username:string, password:string){
		await this.browser.wait(componentIsVisible(()=>this.loginToAccountButton), waitFor.TenSeconds);
		await this.loginToAccountButton.click();
		await this.loginPopup.login(username,password);
	}

	/**
	 * Completes the section and will continue the rest of the process process as a guest.
	 */
	public async continueAsGuest(){
		await this.browser.wait(componentIsVisible(()=>this.containueAsGuestButton), waitFor.TenSeconds);
		await this.containueAsGuestButton.click();
	}
}

class ShippingOptionSection {

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

	@findByCSS("label[for='inStorePickupRadio']")
	private inStorePickupOption: WebComponent;

	@findByCSS("select[id='states']")
	private stateSelector: Selector;

	@findById("locationId")
	private storeSelector: Selector;

	@findById("giftCardEmail1")
	private giftCardEmailInput: TextInput;

	@findById("personalMessage1")
	private personalMessageInput: TextInput;

	@findById("deliveryContinueButton")
	private deliveryContinueButton: Button;

	@findById("pickupDate")
	public datepickerInput: WebComponent;

	private datepicker: DatePicker;
	constructor(private browser: IBrowser){
		this.datepicker = new DatePicker(browser);	
	}

	/**
	 * Fillout delivery
	 * @param shippingInformation
	 * @param shippingOption The shipping option
	 */
	public async selectDelivery(shippingInformation=TestAddress, shippingOption: ShippingOptions){
		await this.browser.wait(componentIsVisible(()=>this.firstNameField),waitFor.TenSeconds);
		await this.firstNameField.clearAndType(shippingInformation.firstName);
		await this.lastNameField.clearAndType(shippingInformation.lastName);
		await this.shippingAddress1Field.clearAndType(shippingInformation.streetAddress);
		await this.shippingAddress2Field.clearAndType(shippingInformation.streetAddress2);
		await this.shippingCity.clearAndType(shippingInformation.city);
		await this.shippingState.clearAndType(shippingInformation.state);
		await this.shippingZip.clearAndType(shippingInformation.zip, Key.ENTER);

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

	public async selectInStorePickup(state:States, store:Stores){
		await this.browser.wait(componentIsVisible(()=>this.inStorePickupOption));
		await this.inStorePickupOption.click();
		await this.stateSelector.selectOptionByText(state);
		await this.storeSelector.selectOptionByText(store);
		await this.browser.wait(componentIsVisible(()=>this.datepickerInput));
		await this.datepickerInput.click();
		await this.datepicker.selectNextAvailableDate();
		await this.browser.wait(componentIsVisible(() => this.deliveryContinueButton));
		await this.deliveryContinueButton.click();
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
}

class ContactInformationSection {

	@findByCSS("input[name='contactEmail']")
	private emailInput: TextInput;

	@findById("homePhone")
	private homePhoneInput: TextInput;

	@findById("mobilePhone")
	private mobilePhoneInput: TextInput;

	@findById("workPhone")
	private workPhoneInput: TextInput;

	@findById("contactInfoContinueButton")
	private continueButton: Button;

	constructor(private browser: IBrowser){	}

	/**
	 * Fillout the contact info section
	 * @param contactInformation Information to use to fillout the contact information form.
	 */
	public async enterContactInfo(contactInformation:ContactInformation){
		await this.browser.wait(componentIsVisible(()=>this.emailInput));
		await this.emailInput.clearAndType(contactInformation.email);
		await this.homePhoneInput.clearAndType(contactInformation.homePhone);
		await this.mobilePhoneInput.clearAndType(contactInformation.mobilePhone);
		await this.workPhoneInput.clearAndType(contactInformation.workPhone);
		await this.browser.wait(componentIsVisible(() => this.continueButton));
		await this.continueButton.click();
	}
}

class PaymentSection {

	@findByCSS("label[for='CARD0']")
	private cardSelector: WebComponent;

	@findByCSS("label[for='PAYP0']")
	private paypalSelector: WebComponent;

	@findByCSS("label[for='storeCashier0']")
	private storeCashierSelector: WebComponent;

	@findById("paymentMethod0")
	private creditCardPaymentContainer: WebComponent;

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

	@findById("gcNumber-1")
	private giftCardNumberInput: TextInput;

	@findById("gcAccess-1")
	private accessCodeInput: TextInput;

	constructor(private browser: IBrowser){	}
		
	/**
	 * Enter billing details into the relavent form.
	 * @param address Address information to put into the form.
	 */
	public async enterBillingDetails(address:Address){
		await this.billingFirstName.clearAndType(address.firstName);
		await this.billingLastName.clearAndType(address.lastName);
		await this.billingStreet1.clearAndType(address.streetAddress);
		await this.billingStreet2.clearAndType(address.streetAddress2);
		await this.billingCity.clearAndType(address.city);
		await this.billingState.clearAndType(address.state);
		await this.billingZip.clearAndType(address.zip);
	}

	/**
	 * Fillout the payment details section. 
	 * @param creditCardInfo Relavent info to put into the form.
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

	/**
	 * Select a certain payment method.
	 * @param paymentMethod The payment method to select.
	 */
	public async selectPaymentMethod(paymentMethod:PaymentMethods){	
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
	 * Select the sameBillingAddress checkbox.
	 */
	public selectSameBillingAddress(): Promise<void>{
		return this.sameAddressCheck.click();
	}

	/**
	 * Wait until the button for this section is visible
	 * then click it. 
	 */
	public async submitPaymentInformation(): Promise<void> {
		await this.browser.wait(componentIsVisible(()=>this.continuePaymentButton));
		return this.continuePaymentButton.click();
	}

	/**
	 * Enter gift card information.
	 * @param giftCardNumber 
	 * @param accessCode 
	 */
	public async enterGiftCardInformation(giftCardNumber:string, accessCode:string){
		await this.browser.wait(componentIsVisible(()=>this.giftCardNumberInput));
		await this.giftCardNumberInput.clearAndType(giftCardNumber);
		await this.accessCodeInput.clearAndType(accessCode);
	}	
}


class ReviewOrderSection {

	@findById("finalSubmit")
	private placeOrderButton: Button;

	@findById("backToCart")
	private backToCartButton: Button;

	constructor(private browser: IBrowser){	}

	/**
	 * Finish the checkout process.
	 */
	public async placeOrder(): Promise<void> {
		await this.browser.wait(componentIsVisible(()=>this.placeOrderButton));
		return this.placeOrderButton.click();
	}

	public async goBackToCard(): Promise<void> {
		await this.browser.wait(componentIsVisible(()=>this.backToCartButton));
		return this.backToCartButton.click();
	}
}