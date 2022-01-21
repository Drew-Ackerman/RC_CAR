import { Browser, findByCSS, findById, TextInput, urlContainsValue, WaitCondition, WebComponent, Button } from "../lib";
import { Address, ContactInformation } from "../types";
import { Page } from "../partials/page";

/**
 * Page Object Model for the Personal Profile Page.
 */
export class ViewPersonalProfile extends Page {

	@findById("customer.billingPerson.firstName")
	public firstNameInput: TextInput;

	@findById("customer.billingPerson.lastName")
	public lastNameInput: TextInput;

	@findById("homePhone")
	public homePhoneInput: TextInput;

	@findById("mobilePhone")
	public mobilePhoneInput: TextInput;
	
	@findById("workPhone")
	public workPhoneInput: TextInput;
	
	@findById("customer.billingPerson.contact.address.address1")
	public billingAddress1: TextInput;

	@findById("customer.billingPerson.contact.address.city")
	public billingCity: TextInput;

	@findById("customer.billingPerson.contact.address.state")
	public billingState: TextInput;

	@findById("zipCode")
	public billingZip: TextInput;

	@findByCSS("label[for='sameAsBilling']")
	public sameAddressCheckbox: WebComponent;

	@findById("submitPersonalProfileChanges")
	public submitButton: Button;

	constructor(browser: Browser){
		super(browser);
	}

	/**
	 * Fill out the form to update user data.
	 * @param billingInformation 
	 * @param contactInfo
	 * @returns The account home page that should appear upon successful update of user data
	 */
	public async completeUserData(billingInformation: Address, contactInfo: ContactInformation){
		await this.firstNameInput.clearAndType(billingInformation.firstName);
		await this.lastNameInput.clearAndType(billingInformation.lastName);

		await this.homePhoneInput.clearAndType(contactInfo.homePhone);
		await this.mobilePhoneInput.clearAndType(contactInfo.mobilePhone);
		await this.workPhoneInput.clearAndType(contactInfo.workPhone);

		await this.billingAddress1.clearAndType(billingInformation.streetAddress);
		await this.billingCity.clearAndType(billingInformation.city);
		await this.billingState.clearAndType(billingInformation.state);
		await this.billingZip.clearAndType(billingInformation.zip);

		await this.sameAddressCheckbox.click();
		await this.submitButton.click();
	}

	public loadCondition(): WaitCondition {
		return urlContainsValue(this.browser, "View-Personal-Profile");
	}
}