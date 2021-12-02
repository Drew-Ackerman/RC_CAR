/**
 * A configuration object for common variables used throughout RC_CAR
 */
export const config = {
    baseUrl: process.env.BASE_URL || 'https://rcwtest.rcwilley.com/',
    testEmployee: {username:'web.adminone', password:'I\'malittleteapot'},
    testAddress: {street:'DemoStree', city:'democity', zip:'84405'}
} 



/**
 * @enum List of supported browsers that can be used for testing.
 */
export enum SupportedBrowsers {
    Chrome = "chrome",
    Firefox = "firefox",
}
