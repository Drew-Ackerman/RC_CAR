import { Browser, Button, findAllByClass, findByClass, findByLinkText, Page, pageHasLoaded, WaitCondition, WebComponent, WebComponents } from "../lib";
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
    
    @findByLinkText('Checkout')
    private CheckoutButton: Button;

    @findAllByClass('cartItem')
    public CartItems: WebComponents;

    constructor(protected browser:Browser){
        super(browser);
    }

    public loadCondition(): WaitCondition {
        throw new Error("Method not implemented.");
    }

    public async Checkout(): Promise<CheckoutPage> {
        await this.CheckoutButton.click();
        await this.browser.wait(pageHasLoaded(CheckoutPage));
        return new CheckoutPage(this.browser);
    }
    
}