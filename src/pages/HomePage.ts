import { Header } from "../components";
import { Browser, elementIsVisible, findByClass, findById, Page, WebComponent } from "../lib";
import { config } from "../../config";

/**
 * @classdesc POM for the home page of RC Willey
 */
export class HomePage extends Page{

    @findByClass('rcwlogo')
    public RCLogo : WebComponent;

    private header: Header;

    constructor(browser: Browser){
        super(browser)
        this.setUrl( `${config.baseUrl}`)
        this.header = new Header(browser);
    }

    /**
     * Click the account button
     * @returns A promise for a login page POM
     */
    async GoToLoginPage(){
        return this.header.ClickAccountButton();
    }

    public async Search(searchText:string){
        return this.header.SearchForItem(searchText);
    }

    /**
     * The home page is loaded when the RC logo is visible
     * @returns A conditon that evaluates when the logo is visible. 
     */ 
    public loadCondition() {
        return elementIsVisible(() => this.RCLogo);
    }
}