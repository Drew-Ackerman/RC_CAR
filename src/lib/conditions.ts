import { WebComponent} from "./components";
import { IBrowser } from "../interfaces/IBrowser";
import { IPage } from "../interfaces/IPage";
  
/**
 * These conditions are used in conjunciton with the wait method of the browser class. 
 * These conditions can be used to delay action until something occurs, like an element is visible, 
 * or certain text becomes present on an element.  
 */

/**
 * @type alias, take in a Browser, return a promise that will evaluate to a boolean.  
 */
export type WaitCondition = (browser:IBrowser) => Promise<boolean>;

/**
 * Wait for a WebComponent to be disabled
 * @param locator A function returning a {@link Webcomponent}
 * @returns True if the components attribute "disabled" is true, otherwise false.
 */
export function componentIsDisabled(locator: () => WebComponent): WaitCondition {
	return async function () {
		try {
			return await locator().getAttribute("disabled") === "disabled";
		} catch (ex) {
			return false;
		}
	};
}

/**
 * Wait for a WebComponent to be displayed
 * @param locator A function returning a {@link WebComponent}
 * @returns True if visible, false otherwise. 
 */
export function componentIsVisible(locator: () => WebComponent): WaitCondition {
	return async () => await locator().isDisplayed();
}

/**
 * Wait until a WebComponent is not visible.
 * @param locator A function returning a {@link WebComponent}
 * @returns True if not visible, false otherwise. 
 */
export function componentIsNotVisible(locator: () => WebComponent): WaitCondition {
	return async () => await locator().isDisplayed() === false;
}

/**
 * A wait condition for waiting till a webcomponent contains certain text.
 * @param locator A function that returns a webcomponent
 * @param expectedText The text to look for on the webcomponent.
 */
export function componentHasText(locator: () => WebComponent, expectedText:string): WaitCondition {
	return async () => await (await locator().getText()).includes(expectedText);
}

/**
 * Ensure a WebComponent is present in the DOM, doesnt mean visible. 
 * @param locator The WebComponent
 * @returns A promise to be waited upon.  
 */
export function componentIsPresent(locator: () => WebComponent): WaitCondition {
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