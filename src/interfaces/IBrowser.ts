import "chromedriver";
import { ThenableWebDriver, WebElementPromise, ByHash, WebElement, IWebDriverCookie, IWebDriverOptionsCookie, TargetLocator, Actions} from "selenium-webdriver";
import { WaitCondition } from "../lib/conditions";

/**
 * @classdesc A wrapper for the selenium browser driver. 
 * This class allows interacting with the browser, finding elements
 * navigating to pages with urls, working with browser windows, etc. 
 */
export interface IBrowser{

	driver: ThenableWebDriver;
	
	maximize(): Promise<void>;

	getWindowHandles(): Promise<Array<string>>;
	
	getCurrentWindowHandle(): Promise<string>;

	getPageTitle(): Promise<string>;

	actions(options:any): Promise<Actions>;

	/**
	 * @param url The web url to go to.
	 */
	navigate(url: string): Promise<void>;

	/**
	 * Find an element based off a selector hash given,
	 * generally use the findBy decorators in utils.ts, but you can directly select
	 * things if those are not felxible enough. 
	 * @param selectorHash A selenium selector hash with {type:locator} like, {css:'.classname'}.
	 * @returns A Promise that returns a Web Element, or undefined if not found.
	 */
	findElement(selectorHash: ByHash | (() => WebElement) ): WebElementPromise;

	/**
	 * Find a collection of elements that are described by the given selector hash.
	 * @param selectorHash A selenium selector hash, {type:locator}
	 * @returns A list of web element 
	 */
	findElements(selectorHash: ByHash ): Promise<WebElement[]>;

	/**
	 * @returns The current browser url
	 */
	currentUrl(): Promise<string>;

	/**
	 * Close the browser.
	 */
	close(): Promise<void>;

	/**
	 * @description Clear browser cookies.
	 */
	clearCookies(): Promise<void>;

	/**
	 * Adds a cookie to the current browser. 
	 * @param cookie A selenium cookie object 
	 */
	addCookie(cookie: IWebDriverOptionsCookie): Promise<void>;

	/**
	 * Deletes a cookie with the specified name. If the cookie doesnt exist, then
	 * nothing happens. 
	 * @param name The name of the cookie to delete
	 */
	deleteCookie(name: string): Promise<void>;

	/**
	 * @param name Name of the cookie
	 * @returns The cookie if it exists, else null.
	 */
	getCookie(name:string): Promise<IWebDriverCookie>;

	/**
	 * 
	 * @returns An array of existing cookies.
	 */
	getCookies(): Promise<Array<IWebDriverCookie>>;

	/**
	 * @returns Take a screenshot ans save it to a location. 
	 */
	takeScreenshot(path:string): Promise<void>;

	/**
	 * @param seconds The amount of seconds to sleep for
	 * @returns A promise to sleep for a period of time.
	 */
	sleep(seconds:number) : Promise<void>;

	/**
	 * Used for switching the context 
	 * @returns The target locator, which allows switching to frame and windows.
	 */
	switchTo(): Promise<TargetLocator>;

	/**
	 * Wait for a specific condition to be satisfied. Usefull when elements
	 * havnt loaded in or when actions take time to occur.
	 * @param condition A condition to evaluate
	 */
	wait(condition: WaitCondition, optionalTimeout?:number, optionalMessage?:string): Promise<void>;

	/**
	 * Wait till one of one or many conditoons to be satisfied. 
	 * @param conditions 1 or many {@link WaitCondition WaitConditions} to fulfill.
	 */ 
	waitAny(conditions: WaitCondition | WaitCondition[], optionalTimeout?:number, optionalMessage?:string): Promise<void>;
}