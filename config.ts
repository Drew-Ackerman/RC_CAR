/**
 * A configuration object for common variables used throughout RC_CAR
 */
export const config = {
    baseUrl: process.env.BASE_URL || 'https://rcwtest.rcwilley.com/',
}

/**
 * @enum List of supported browsers that can be used for testing.
 */
export enum SupportedBrowsers {
    Chrome = "chrome",
    Firefox = "firefox",
}
