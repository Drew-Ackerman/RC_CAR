import { Browser, WaitCondition } from ".";
import { Header } from "../components";

/**
 * 
 */
export interface NewablePage<T extends Page> {
    new(browser: Browser): T;
}

/**
 * @classdesc Every POM derives from this base class.
 */
export abstract class Page {

    private url: string; //The pages url
    public header: Header;
    /**
     * @constructor
     * @param browser 
     */
    public constructor(protected browser: Browser){
        this.header = new Header(browser);
     };

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
            throw new Error(`No url given for page ${this}`)
        }
    }

    /**
     * Set the url property.
     * @param url The url for the page
     */
    public setUrl(url:string) {
        this.url = url;
    }

    /**
     * Every page needs a conditon that is used to determine when it has been loaded.
     */
    public abstract loadCondition(): WaitCondition;
}