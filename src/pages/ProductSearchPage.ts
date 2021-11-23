import { timeStamp } from "console";
import { WebElement } from "selenium-webdriver";
import { Browser, elementIsVisible, findAllByClass, findByClass, Page, pageHasLoaded, WaitCondition, WebComponent, WebComponents } from "../lib";
import { ProductPage } from "./ProductPage";

export class ProductDetails {
    constructor(public sku:string, public price:string, public productName: string){}

    public equalTo(other: ProductDetails){
        return this.sku === other.sku && this.price === other.price && this.productName === other.productName
    }
}

export class ProductCard {

    @findByClass('price')
    private PriceText : WebComponent;

    @findByClass('productName')
    private ProductNameText : WebComponent;

    private browser;
    
    constructor(protected product:WebElement){
        this.browser = product;
     };

    /**
     * @todo fix this, make it return a promise based on if a sku is 
     * available or not. 
     * @returns 
     */
    public async SKU() : Promise<string>{
        let sku = (await this.product.getAttribute('id')).split('-').pop();
        return sku || "Sku Not Found";
    }

    public async Price(): Promise<string> {
        return this.PriceText.getText();
    }

    public async ProductName() : Promise<string> {
        return this.ProductNameText.getText();
    }

    public async Click(): Promise<void>{
        await this.product.click();
    }

    public async getProductDetails() : Promise<ProductDetails>{
        let price = await this.Price();
        let sku = await this.SKU();
        let productName = await this.ProductName();
        return new ProductDetails(sku,price,productName);
    }
}

export class ProductSearchPage extends Page {
    
    @findByClass('mainPageTitle')
    public MainPageTitle : WebComponent;

    @findAllByClass('product')
    private PageProducts : WebComponents;

    constructor(browser:Browser){
        super(browser);
    }

    public async findAllProductsOnPage(): Promise<Array<ProductCard>>{
        let products = await this.PageProducts.getElements();
        let productCards = await products.map((element) => {
            return new ProductCard(element);
        });
        return productCards;
    }

    public async selectProduct(product: ProductCard): Promise<ProductPage>{
        await product.Click();
        await this.browser.wait(pageHasLoaded(ProductPage));
        return new ProductPage(this.browser).attachProduct(product);
    }

    public loadCondition(): WaitCondition {
        return elementIsVisible(() => this.MainPageTitle);
    }
}