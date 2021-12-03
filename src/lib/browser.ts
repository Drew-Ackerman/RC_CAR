import "chromedriver";
import { Builder, ThenableWebDriver, WebElementPromise, ByHash, WebElement, IWebDriverCookie, IWebDriverOptionsCookie, TargetLocator, Actions} from "selenium-webdriver";
import { WaitCondition } from "./conditions";
import { SupportedBrowsers } from "../../config";
import { writeFile } from "fs";

/**
 * @classdesc A wrapper for the selenium browser driver. 
 */
export class Browser{

	private driver: ThenableWebDriver;

	/**
	 * @param browserName The browser to use.
	 */
	public constructor(private browserName: SupportedBrowsers){
		this.driver = new Builder().forBrowser(browserName).build();
	}

	/**
	 * @returns A list of available browser window handles. 
	 */
	get WindowHandles(): Promise<Array<string>> {
		return this.driver.getAllWindowHandles();
	}

	/**
	 * @returns The handle for the currently focused window.
	 */
	get CurrentWindowHandle(): Promise<string> {
		return this.driver.getWindowHandle();
	}

	get PageTitle(): Promise<string> {
		return this.driver.getTitle();
	}

	public async actions(options:any): Promise<Actions> {
		return this.driver.actions(options);
	}

	/**
	 * @param url The web url to go to.
	 */
	public async navigate(url: string): Promise<void>{
		await this.driver.navigate().to(url);
	}

	/**
	 * Find an element based off a selector hash given,
	 * generally use the findBy decorators in utils.ts, but you can directly select
	 * things if those are not felxible enough. 
	 * @param selectorHash A selenium selector hash with {type:locator} like, {css:'.classname'}.
	 * @returns A Promise that returns a Web Element, or undefined if not found.
	 */
	public findElement(selectorHash: ByHash | (() => WebElement) ): WebElementPromise{
		return this.driver.findElement(selectorHash);
	}

	/**
	 * 
	 * @param selectorHash 
	 * @returns 
	 */
	public findElements(selectorHash: ByHash ): Promise<WebElement[]> {
		return this.driver.findElements(selectorHash);
	}

	/**
	 * @returns The current browser url
	 */
	public async currentUrl(): Promise<string>{
		return this.driver.getCurrentUrl();
	}

	/**
	 * Close the browser.
	 */
	public async close(): Promise<void>{
		await this.driver.quit();
	}

	/**
	 * @description Clear browser cookies.
	 */
	public async clearCookies(): Promise<void>{
		await this.driver.manage().deleteAllCookies();
	}

	/**
	 * Adds a cookie to the current browser. 
	 * @param cookie A selenium cookie object 
	 */
	public async addCookie(cookie: IWebDriverOptionsCookie): Promise<void>{
		await this.driver.manage().addCookie(cookie);
	}

	/**
	 * Deletes a cookie with the specified name. If the cookie doesnt exist, then
	 * nothing happens. 
	 * @param name The name of the cookie to delete
	 */
	public deleteCookie(name: string): Promise<void>{
		return this.driver.manage().deleteCookie(name);
	}

	/**
	 * @param name Name of the cookie
	 * @returns The cookie if it exists, else null.
	 */
	public getCookie(name:string): Promise<IWebDriverCookie>{
		return this.driver.manage().getCookie(name);
	}

	/**
	 * 
	 * @returns An array of existing cookies.
	 */
	public getCookies(): Promise<Array<IWebDriverCookie>>{
		return this.driver.manage().getCookies();
	}

	/**
	 * @returns Take a screenshot ans save it to a location. 
	 */
	public async takeScreenshot(path:string): Promise<void>{
		return this.driver.takeScreenshot().then( function(image) {
			writeFile(path, image, "base64", function(err) {
				if(err){
					throw Error(`Error writing screenshot to file: ${err}`);
				}
			});
		});
	}

	/**
	 * @param seconds The amount of seconds to sleep for
	 * @returns A promise to sleep for a period of time.
	 */
	public async sleep(seconds:number) : Promise<void>{
		return this.driver.sleep(seconds * 1000);
	}

	/**
	 * Used for switching the context 
	 * @returns The target locator, which allows switching to frame and windows.
	 */
	public async switchTo(): Promise<TargetLocator>{
		return this.driver.switchTo();
	}

	/**
	 * Wait for a specific condition to be satisfied. Usefull when elements
	 * havnt loaded in or when actions take time to occur.
	 * @param condition A condition to evaluate
	 */
	public async wait(condition: WaitCondition) {
		await this.waitAny(condition);
	}

	/**
	 * Wait till one of one or many conditoons to be satisfied. 
	 * @param conditions 1 or many conditions to fulfill.
	 */ 
	public async waitAny(conditions: WaitCondition | WaitCondition[]) : Promise <void> {
		//Treat all conditions as an array of conditions. 
		const all = (!(conditions instanceof Array)) ? [conditions] : conditions;
		
		await this.driver.wait(async () => {
			for (const conditon of all)
			{
				//Await the condition.
				try{
					if(await conditon(this) === true){
						return true;
					}
					continue;
				} catch (ex) {
					continue;
				}
			}
		});
	}
}