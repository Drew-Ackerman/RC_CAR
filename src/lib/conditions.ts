import { WebComponent} from "./elements";
import { IBrowser } from "../interfaces/IBrowser";
import { IPage } from "../interfaces/IPage";
  
/**
 * @type alias, take in a Browser, return a promise that will evaluate to a boolean.  
 */
export type WaitCondition = (browser:IBrowser) => Promise<boolean>;

/**
 * Wait for a WebComponent to be displayed
 * @param locator A function returning a {@link WebComponent}
 * @returns True if visible, false otherwise. 
 */
export function elementIsVisible(locator: () => WebComponent): WaitCondition {
	return async () => await locator().isDisplayed();
}

export function elementIsNotVisible(locator: () => WebComponent): WaitCondition {
	return async () => await !(locator().isDisplayed());
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
 * Create a {@link WaitCondition} that can be used to wait for a specific url to be present in the browser
 * @param browser The {@link Browser}
 * @param url The url to wait for
 * @returns A {@link WaitCondition} promise to be waited upon.
 */
export function urlIsValue(browser: IBrowser, url: string) : WaitCondition {
	return async () => await browser.currentUrl() === url;
}

/**
 * 
 * @param browser The {@link Browser}
 * @param partialUrl 
 * @returns A {@link WaitCondition} promise to be waited upon.
 */
export function urlContainsValue(browser: IBrowser, partialUrl: string) : WaitCondition {
	return async () => await (await browser.currentUrl()).includes(partialUrl);
}

/**
 * Waits until the url has changed in the browser. 
 * @param browser 
 * @param previousUrl 
 * @returns 
 */
export function urlChanged(browser: IBrowser, previousUrl: string) : WaitCondition {
	return async () => await (await browser.currentUrl()) !== previousUrl;
}

/**
 * Instantiate a new page, and then return a Promise that will resolve when
 * a page has loaded. Each page defines its own condtion for when it considers itself loaded.
 * @param page The page that will be instantiated
 * @returns A boolean promise that evaluates when a page is loaded. 
 */
export function pageHasLoaded(page: IPage): WaitCondition {
	return (browser: IBrowser) => {
		const condition = page.loadCondition();
		return condition(browser);
	};
}