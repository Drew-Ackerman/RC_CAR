import { Browser, findByCSS, findById, Page, TextInput, urlContainsValue, WaitCondition, WebComponent, Button, pageHasLoaded } from "../lib";
import { AccountHomePage } from "./AccountHomePage";

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

	public async CompleteUserData(firstName: string, lastName: string, phone: string, 
		billingAddress: string, billingCity: string, billingState: string, billingZip: string){
		await this.FirstNameInput.type(firstName);
		await this.LastNameInput.type(lastName);

		await this.HomePhoneInput.type(phone);
		await this.MobilePhoneInput.type(phone);
		await this.WorkPhoneInput.type(phone);

		await this.BillingAddress1.type(billingAddress);
		await this.BillingCity.clear();
		await this.BillingCity.type(billingCity);
		await this.BillingState.clear();
		await this.BillingState.type(billingState);
		await this.BillingZip.clear();
		await this.BillingZip.type(billingZip);

		await this.SameAddressCheckbox.click();
		await this.SubmitButton.click();
		await this.browser.wait(pageHasLoaded(AccountHomePage));
		return new AccountHomePage(this.browser);
	}

	public loadCondition(): WaitCondition {
		return urlContainsValue(this.browser, "View-Personal-Profile");
	}
}