import { Address } from "./src/types";
import { ContactInformation } from "./src/types/ContactInformation";
import { CreditCardInformation } from "./src/types/PaymentInformation";

/**
 * A configuration object for common variables used throughout RC_CAR
 */
export const config = {
	// baseUrl: process.env.BASE_URL || "https://localhost:8443/",
	baseUrl: process.env.BASE_URL || "https://rcwtest.rcwilley.com/",
	testEmployee: {username:"web.adminone", password:"WILLRESETPASSWORD1@q"},
	testAddress: {street:"DemoStree", city:"democity", zip:"84405"}

};

/**
 * An address useful for testing.
 */
export const TestAddress: Address = {
	firstName: "Demo",
	lastName: "Lition",
	streetAddress: "Demo",
	streetAddress2: "Demo",
	city: "DemoCity",
	state: "UT",
	zip: "84405",
};

/**
 * Useful for testing
 */
export const TestCreditCard: CreditCardInformation = {
	creditCardNumber: "4111111111111111",
	creditCardExp: "1230",
	creditCardCSV: "411",
};

/**
 * Useful for testing
 */
export const TestContactInfo: ContactInformation = {
	email: "demo@demo.com",
	homePhone: "8011111111",
	workPhone: "8011111111",
	mobilePhone: "8011111111",
};

/**
 * Time constants for use in browser waits
 */
export const waitFor = {
	Second: 1000,
	TenSeconds: 1000 * 10,
	ThirtySeconds: 1000 * 10 * 3,
	OneMinute: 1000 * 100
};


/**
 * @enum List of supported browsers that can be used for testing.
 */
export enum SupportedBrowsers {
	Chrome = "chrome",
	Firefox = "firefox",
}
