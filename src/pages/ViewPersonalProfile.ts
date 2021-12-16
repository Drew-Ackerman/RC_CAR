import { Browser, findByCSS, findById, Page, TextInput, urlContainsValue, WaitCondition, WebComponent, Button, pageHasLoaded } from "../lib";
import { Address, ContactInformation } from "../types";
import { AccountHomePage } from "./accountPages";

export class ViewPersonalProfile extends Page {

	@findByCSS("input[name='customer.billingPerson.firstName']")
	public FirstNameInput: TextInput;

	@findByCSS("input[name='customer.billingPerson.lastName']")
	public LastNameInput: TextInput;

	@findById("homePhone")
	public HomePhoneInput: TextInput;

	@findById("mobilePhone")
	public MobilePhoneInput: TextInput;
	
	@findById("workPhone")
	public WorkPhoneInput: TextInput;
	
	@findByCSS("input[name='customer.billingPerson.contact.address.address1']")
	public BillingAddress1: TextInput;

	@findByCSS("input[name='customer.billingPerson.contact.address.city']")
	public BillingCity: TextInput;

	@findByCSS("input[name='customer.billingPerson.contact.address.state']")
	public BillingState: TextInput;

	@findById("zipCode")
	public BillingZip: TextInput;

	@findByCSS("label[for='sameAsBilling']")
	public SameAddressCheckbox: WebComponent;

	@findByCSS("button[type='submit']")
	public SubmitButton: Button;

	constructor(browser: Browser){
		super(browser);
	}

	public async CompleteUserData(billingInformation: Address, contactInfo: ContactInformation){
		await this.FirstNameInput.type(billingInformation.firstName);
		await this.LastNameInput.type(billingInformation.lastName);

		await this.HomePhoneInput.type(contactInfo.homePhone);
		await this.MobilePhoneInput.type(contactInfo.mobilePhone);
		await this.WorkPhoneInput.type(contactInfo.workPhone);

		await this.BillingAddress1.type(billingInformation.streetAddress);
		await this.BillingCity.clear();
		await this.BillingCity.type(billingInformation.city);
		await this.BillingState.clear();
		await this.BillingState.type(billingInformation.state);
		await this.BillingZip.clear();
		await this.BillingZip.type(billingInformation.zip);

		await this.SameAddressCheckbox.click();
		await this.SubmitButton.click();
		await this.browser.wait(pageHasLoaded(AccountHomePage));
		return new AccountHomePage(this.browser);
	}

	public loadCondition(): WaitCondition {
		return urlContainsValue(this.browser, "View-Personal-Profile");
	}
}