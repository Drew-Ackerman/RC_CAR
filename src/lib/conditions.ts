import { Browser, WebComponent, Page, NewablePage } from ".";

/**
 * @type alias, take in a Browser, return a promise that will evaluate to a boolean.  
 */
export type WaitCondition = (browser:Browser) => Promise<boolean>;

/**
 * Wait for a WebComponent to be displayed
 * @param locator The WebComponent 
 * @returns True if visible, false otherwise. 
 */
export function elementIsVisible(locator: () => WebComponent): WaitCondition {
	return async () => await locator().isDisplayed();
}

/**
 * Ensure a WebComponent is present in the DOM, doesnt mean visible. 
 * @param locator The WebComponent
 * @returns A promise to be waited upon.  
 */
export function elementIsPresent(locator: () => WebComponent): WaitCondition {
	return async () => await locator() !== undefined;
}

/**
 * Create a @WaitCondition that can be used to wait for a specific url to be present in the browser
 * @param browser The browser
 * @param url The url to wait for
 * @returns A promise to be waited upon.
 */
export function urlIsValue(browser: Browser, url: string) : WaitCondition {
	return async () => await browser.currentUrl() === url;
}

/**
 * 
 * @param browser 
 * @param partialUrl 
 * @returns 
 */
export function urlContainsValue(browser: Browser, partialUrl: string) : WaitCondition {
	return async () => await (await browser.currentUrl()).includes(partialUrl);
}

/**
 * Waits until the url has changed in the browser. 
 * @param browser 
 * @param previousUrl 
 * @returns 
 */
export function urlChanged(browser: Browser, previousUrl: string) : WaitCondition {
	return async () => await (await browser.currentUrl()) !== previousUrl;
}

/**
 * Instantiate a new page, and then return a Promise that will resolve when
 * a page has loaded. Each page defines its own condtion for when it considers itself loaded.
 * @param page The page that will be instantiated
 * @returns A boolean promise that evaluates when a page is loaded. 
 */
export function pageHasLoaded<T extends Page>(page: NewablePage<T>): WaitCondition {
	return (browser: Browser) => {
		const condition = new page(browser).loadCondition();
		return condition(browser);
	};
}