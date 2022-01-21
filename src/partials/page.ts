import { IBrowser } from "../interfaces/IBrowser";
import { IHeader } from "../interfaces/IHeader";
import { IPage } from "../interfaces/IPage";
import { WaitCondition } from "../lib/conditions";
import { Header } from "./header";

/**
 * @classdesc Every POM derives from this base class.
 */
export abstract class Page implements IPage{

	private url: string; //The pages url
	public header: IHeader;
	
	/**
	 * @constructor
	 * @param browser 
	 */
	public constructor(protected browser: IBrowser){
		this.header = new Header(browser);
	}

	/**
	 * Navigates to this pages url.
	 * @throws An error if the url property is undefined. 
	 */
	public async navigate(): Promise<void>{
		if(this.url){
			await this.browser.navigate(this.url);
			await this.browser.wait(this.loadCondition());
		}
		else
		{
			throw new Error(`No url given for page ${this}`);
		}
	}

	/**
	 * Set the url property.
	 * @param url The url for the page
	 */
	public setUrl(url:string): void {
		this.url = url;
	}

	/**
	 * Every page needs a conditon that is used to determine when it has been loaded.
	 */
	public abstract loadCondition(): WaitCondition;
}