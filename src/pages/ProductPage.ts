import { WebElement } from "selenium-webdriver";
import { Browser, Button, elementIsVisible, findByClass, findById, Page, pageHasLoaded, WaitCondition, WebComponent } from "../lib";
import { ProductDetails, ProductCard } from "./ProductSearchPage";
import { ShoppingCartPage } from "./ShoppingCartPage";


export class ProductPage extends Page {
    
    private async findProductNameText(browser:Browser): Promise<WebElement>{
        var productNameFields = await browser.findElements({id:'prodName'});

        for (let productNameField of productNameFields){
            let visible = await productNameField.isDisplayed();
            if(visible){
                return productNameField;
            }
        }

        throw Error('Cannot find product name text');
    }

    @findById('addToCartBtn')
    private AddToCardButton: Button;

    @findById('sku')
    private SKU: WebComponent;

    @findByClass('priceBlock')
    private Price: WebComponent;

    // @findById('prodName')
    // private ProductName: WebComponent;

    private product: ProductCard;
    constructor(protected browser: Browser){
        super(browser);
    };
    
    public loadCondition(): WaitCondition {
        return elementIsVisible(() => this.AddToCardButton);
    }

    public attachProduct(product: ProductCard): ProductPage{
        this.product = product;
        return this;
    }

    public async addToCart(): Promise<ShoppingCartPage>{
        await this.AddToCardButton.click();
        await this.browser.wait(pageHasLoaded(ShoppingCartPage));
        return new ShoppingCartPage(this.browser);
    }

    public async getProductDetails(): Promise<ProductDetails>{
        return new ProductDetails(await (await this.SKU.getText()).split(':')?.pop()?.trim() || "Sku not found", await this.Price.getText(), await (await this.browser.findElement(this.findProductNameText)).getText());
    }

    public async hasTheProduct(product:ProductDetails): Promise<boolean>{
        var pageProductDetails = await this.getProductDetails();
        let sameProduct = await pageProductDetails.equalTo(product);
        if(!sameProduct){
            throw Error(`Not the same product. On product page with SKU ${await this.SKU.getText()}, expected ${await this.product.SKU()}`)
        }
        return true;
    }
}