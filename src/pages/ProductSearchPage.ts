import { WebElement } from "selenium-webdriver";
import { Browser, elementIsVisible, findAllByClass, findByClass, Page, pageHasLoaded, WaitCondition, WebComponent, WebComponents } from "../lib";
import { ProductPage } from "./ProductPage";

export class Product {

    @findByClass('price')
    public PriceText : WebComponent;

    @findByClass('productName')
    public ProductNameText : WebComponent;

    constructor(protected product:WebElement){ };

    /**
     * @todo fix this, make it return a promise based on if a sku is 
     * available or not. 
     * @returns 
     */
    public async SKU() {
        let sku = await (await this.product.getAttribute('id')).split('-').pop();
        return sku;
    }

    public async Price(): Promise<string> {
        return await this.PriceText.getText();
    }

    public async ProductName() : Promise<string> {
        return await this.ProductNameText.getText();
    }

    public async Click(): Promise<void>{
        await this.product.click();
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

    public async findAllProductsOnPage(): Promise<Array<Product>>{
        let products = await this.PageProducts.getElements();
        let productCards = await products.map((element) => {
            return new Product(element);
        });
        return productCards;
    }

    public async selectProduct(product: Product) {
        await product.Click();
        await this.browser.wait(pageHasLoaded(ProductPage));
        return new ProductPage(this.browser).attachProduct(product);
    }

    public loadCondition(): WaitCondition {
        return elementIsVisible(() => this.MainPageTitle);
    }
}