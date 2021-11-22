import { Browser, Button, elementIsVisible, findByClass, findById, Page, pageHasLoaded, WaitCondition, WebComponent } from "../lib";
import { Product } from "./ProductSearchPage";
import { ShoppingCartPage } from "./ShoppingCartPage";


export class ProductPage extends Page {
    
    @findById('addToCartBtn')
    private AddToCardButton: Button;

    @findById('sku')
    private SKU: WebComponent;

    @findByClass('priceBlock')
    private Price: WebComponent;

    @findByClass('productName')
    private ProductName: WebComponent;

    private product: Product;
    constructor(protected browser: Browser){
        super(browser);
    };
    
    public loadCondition(): WaitCondition {
        return elementIsVisible(() => this.AddToCardButton);
    }

    public attachProduct(product: Product){
        this.product = product;
    }

    public async addToCart(): Promise<ShoppingCartPage>{
        await this.AddToCardButton.click();
        await this.browser.wait(pageHasLoaded(ShoppingCartPage));
        return new ShoppingCartPage(this.browser);
    }

    private async VerifyProduct(product:Product){
        return await this.product.ProductName() == await this.ProductName.getText() &&
            await this.product.Price() == await this.Price.getText() &&
            await this.product.SKU() == await this.SKU.getText();
    }
}