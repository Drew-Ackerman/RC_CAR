import { IBrowser } from "./IBrowser";
import { IPage } from "./IPage";

/**
 * 
 */
export interface INewablePage<T extends IPage> {
	new(browser: IBrowser): T;
}
