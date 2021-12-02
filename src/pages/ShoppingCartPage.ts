import { Browser, Button, findAllByClass, findByClass, findByCSS, findByLinkText, Page, pageHasLoaded, urlContainsValue, WaitCondition, WebComponent, WebComponents } from "../lib";
import { CheckoutPage } from "./CheckoutPage";

export class CartItem {

    @findByClass('prodName')
    private ProductNameText: WebComponent;

    @findByClass('prodInfo')
    private productInfoText:WebComponent;

    constructor(private browser: WebComponent){}

    public async ProductName(): Promise<string>{
        return await this.ProductNameText.getText();
    }

    public async ProductInfo(): Promise<string>{
        return await this.productInfoText.getText();
    }
}


export class ShoppingCartPage extends Page {
    
    private async findCheckoutButton(browser: Browser){
        let buttons = await browser.findElements({css:"a[href='/Proceed-To-Checkout']"});
        for(let i = 0; i < buttons.length; i++){
            let displayed = await buttons[i].isDisplayed();
            if(displayed){
                return buttons[i];
            }
        };
        throw new Error('Couldnt find a visible checkout button');
    }

    @findAllByClass('cartItem')
    public CartItems: WebComponents;

    constructor(protected browser:Browser){
        super(browser);
    }

    public loadCondition(): WaitCondition {
        return urlContainsValue(this.browser, 'Shopping-Cart');
    }

    public async Checkout(): Promise<CheckoutPage> {
        let checkoutButton = await this.browser.findElement(this.findCheckoutButton)
        checkoutButton.click();
        await this.browser.wait(pageHasLoaded(CheckoutPage));
        return new CheckoutPage(this.browser);
    }
    
}