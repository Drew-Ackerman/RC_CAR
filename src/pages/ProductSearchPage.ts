import { WebElement } from "selenium-webdriver";
import { Browser, elementIsVisible, findAllByClass, findByClass, WaitCondition, WebComponent, WebComponents } from "../lib";
//import { ProductPage } from "./ProductPage";
import { Page } from "../components/page";

export class ProductDetails {
	constructor(public sku:string, public price:string, public productName: string){}

	public equalTo(other: ProductDetails){
		return this.sku === other.sku && this.price === other.price && this.productName === other.productName;
	}
}

export class ProductCard {

	@findByClass("price")
	private PriceText : WebComponent;

	@findByClass("productName")
	private ProductNameText : WebComponent;

	private browser;
	
	constructor(protected product:WebElement){
		this.browser = product;
	}

	/**
	 * @todo fix this, make it return a promise based on if a sku is 
	 * available or not. 
	 * @returns 
	 */
	public async SKU() : Promise<string>{
		const sku = (await this.product.getAttribute("id")).split("-").pop();
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
		const price = await this.Price();
		const sku = await this.SKU();
		const productName = await this.ProductName();
		return new ProductDetails(sku,price,productName);
	}
}

export class ProductSearchPage extends Page {
	
	@findByClass("mainPageTitle")
	public MainPageTitle : WebComponent;

	@findAllByClass("product")
	private PageProducts : WebComponents;

	constructor(browser:Browser){
		super(browser);
	}

	/**
	 * 
	 * @returns The filters selected on the products page.
	 */
	public async getActiveFilters(): Promise<Array<string>>{
		const filterDiv = await this.browser.findElement({className:"filtervalues"});
		const filters = await filterDiv.findElements({css:"a"});
		const promises = filters.map(async (filter) => {return await filter.getText();});
		const filterTexts = Promise.all(promises);
		return filterTexts;
	}

	/**
	 * 
	 * @returns A promise to an array of products that are on the page
	 */
	public async findAllProductsOnPage(): Promise<Array<ProductCard>>{
		const products = await this.PageProducts.getElements();
		const productCards = await products.map((element) => {
			return new ProductCard(element);
		});
		return productCards;
	}

	/**
	 * All products are listed in a card format on the search page. 
	 * To get to that products page the card is clicked. To ensure the 
	 * product page is loaded correctly, the product card and its related 
	 * data is sent to the page. 
	 * @param product The product to select from the search page
	 * @returns The products page
	 */
	public async selectProduct(product: ProductCard){//}: Promise<ProductPage>{
		await product.Click();
		//await this.browser.wait(pageHasLoaded(ProductPage));
		//return new ProductPage(this.browser).attachProduct(product);
	}

	/**
	 * 
	 * @returns Page is loaded when the main page title is visible. 
	 */
	public loadCondition(): WaitCondition {
		return elementIsVisible(() => this.MainPageTitle);
	}
}