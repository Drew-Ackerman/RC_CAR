import { WaitCondition } from "../lib/conditions";
import { IHeader } from "./IHeader";

/**
 * @classdesc Every POM derives from this base class.
 */
export interface IPage {

	header: IHeader;

	/**
	 * Navigates to this pages url.
	 * @throws An error if the url property is undefined. 
	 */
	navigate(): Promise<void>;

	/**
	 * Set the url property.
	 * @param url The url for the page
	 */
	setUrl(url:string): void;

	/**
	 * Every page needs a conditon that is used to determine when it has been loaded.
	 */
	loadCondition(): WaitCondition;
}