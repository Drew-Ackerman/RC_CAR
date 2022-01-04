import { Browser, findByCSS, findById, TextInput, urlContainsValue, WaitCondition, WebComponent, Button, pageHasLoaded } from "../lib";
import { Address, ContactInformation } from "../types";
import { AccountHomePage } from "./AccountHomePage";
import { Page } from "../components/page";

export class ViewPersonalProfile extends Page {

	@findById("customer.billingPerson.firstName")
	public FirstNameInput: TextInput;

	@findById("customer.billingPerson.lastName")
	public LastNameInput: TextInput;

	@findById("homePhone")
	public HomePhoneInput: TextInput;

	@findById("mobilePhone")
	public MobilePhoneInput: TextInput;
	
	@findById("workPhone")
	public WorkPhoneInput: TextInput;
	
	@findById("customer.billingPerson.contact.address.address1")
	public BillingAddress1: TextInput;

	@findById("customer.billingPerson.contact.address.city")
	public BillingCity: TextInput;

	@findById("customer.billingPerson.contact.address.state")
	public BillingState: TextInput;

	@findById("zipCode")
	public BillingZip: TextInput;

	@findByCSS("label[for='sameAsBilling']")
	public SameAddressCheckbox: WebComponent;

	@findById("submitPersonalProfileChanges")
	public SubmitButton: Button;

	constructor(browser: Browser){
		super(browser);
	}

	/**
	 * Fill out the form to update user data.
	 * @param billingInformation 
	 * @param contactInfo
	 * @returns The account home page that should appear upon successful update of user data
	 */
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
	}

	public loadCondition(): WaitCondition {
		return urlContainsValue(this.browser, "View-Personal-Profile");
	}
}