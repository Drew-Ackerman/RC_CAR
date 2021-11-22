import { Key } from "selenium-webdriver";
import { Browser, Button, findByCSS, findById, findByLinkText, pageHasLoaded, TextInput, WebComponent } from "../lib";
import { AccountHomePage } from "../pages/AccountHomePage";
import { LoginPage } from "../pages/LoginPage";
import { ProductSearchPage } from "../pages/ProductSearchPage";


/**
 * @classdesc The header is the part of the page that contains things like 
 * the logo, navigation, and the search bar. 
 */
export class Header{

    constructor(private browser:Browser){ }

    /**
     * When logged in the account button can be found this way
     */
    @findById('myAccount')
    public AccountButton: Button;

    /**
     * When not logged in the account button can be found this way
     */
    @findByCSS("img[alt='Account Icon']")
    public LoginButton: Button;

    @findById('header')
    public HeaderBar: WebComponent;

    @findById('searchBox')
    public SearchBoxInput : TextInput;

    /**
     * Click the account button
     */
    async ClickAccountButton(){
        //User isnt logged in yet then
        let loginButtonPresent: boolean = false
        try{
            loginButtonPresent = await this.LoginButton.isDisplayed();
        } catch(error){
            console.log('nope');
        }
        
        if(loginButtonPresent){
            await this.LoginButton.click();
            await this.browser.wait(pageHasLoaded(LoginPage));
            return new LoginPage(this.browser);
        }
        //Otherwise user is logged in
        else{
            await this.AccountButton.click();
            await this.browser.wait(pageHasLoaded(AccountHomePage));
            return new AccountHomePage(this.browser);
        }
    };

    /**
     * Types into the search text input and then sends the enter key. 
     * @param searchText What text to input into the text box
     */
    async SearchForItem(searchText:string): Promise<ProductSearchPage>{
        await this.SearchBoxInput.type(searchText);
        await this.SearchBoxInput.type(Key.ENTER);
        await this.browser.wait(pageHasLoaded(ProductSearchPage));
        return new ProductSearchPage(this.browser);
    }
};