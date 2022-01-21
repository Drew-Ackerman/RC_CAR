import { WebElement } from "selenium-webdriver";
import { Browser, elementIsVisible, findAllByClass, findByClass, urlChanged, WaitCondition, WebComponent, WebComponents } from "../lib";
import { Page } from "../partials/page";
import { FilterBar } from "../partials/FilterBar";
import { ProductDetails } from "../types/ProductDetails";

/**
 * Every search result is treated as a product card.
 */
export class ProductCard {

	@findByClass("price")
	private priceText : WebComponent;

	@findByClass("productName")
	private productNameText : WebComponent;

	private browser;
	
	constructor(protected product:WebElement){
		this.browser = product;
	}

	/**
	 * @todo fix this, make it return a promise based on if a sku is 
	 * available or not. 
	 * @returns 
	 */
	public async sku() : Promise<string>{
		const sku = (await this.product.getAttribute("id")).split("-").pop();
		return sku || "Sku Not Found";
	}

	public async price(): Promise<string> {
		return this.priceText.getText();
	}

	public async productName() : Promise<string> {
		return this.productNameText.getText();
	}

	public async click(): Promise<void>{
		await this.product.click();
	}

	public async getProductDetails() : Promise<ProductDetails>{
		const price = await this.price();
		const sku = await this.sku();
		const productName = await this.productName();
		return new ProductDetails(sku,price,productName);
	}
}

/**
 * The POM for the product search page.
 */
export class ProductSearchPage extends Page {
	
	@findByClass("mainPageTitle")
	public mainPageTitle : WebComponent;

	@findAllByClass("product")
	private pageProducts : WebComponents;

	private filterBar;
	constructor(browser:Browser){
		super(browser);
		this.filterBar = new FilterBar(this.browser);
	}

	/**
	 * Grabs the filters from the filter breadcrumbs. 
	 * @returns A list of applied filters
	 */
	public async getActiveFilters(): Promise<Array<string>>{
		const filterDiv = await this.browser.findElement({className:"filtervalues"});
		const filters = await filterDiv.findElements({css:"a"});
		const promises = filters.map(async (filter) => {return await filter.getText();});
		const filterTexts = Promise.all(promises);
		return filterTexts;
	}

	/**
	 * @returns A promise to an array of products that are on the page
	 */
	public async findAllProductsOnPage(): Promise<Array<ProductCard>>{
		const products = await this.pageProducts.getElements();
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
	 * Should change the page to the product page of the selected product. 
	 */
	public async selectProduct(product: ProductCard){
		await product.click();
	}

	/**
	 * @returns Page is loaded when the main page title is visible. 
	 */
	public loadCondition(): WaitCondition {
		return elementIsVisible(() => this.mainPageTitle);
	}

	/**
	 * Selects a filter option out of the filterbar.
	 * @param filterOption The wanted filter option
	 * @returns The selected filter option
	 */
	public async selectFilterOption(filterOption: string){
		const currentUrl = await this.browser.currentUrl();
		await this.filterBar.waitTillVisible();
		const selectedOption = await this.filterBar.selectTextFilterOption(filterOption);
		await this.browser.wait(urlChanged(this.browser, currentUrl));
		return selectedOption;
	}
}

