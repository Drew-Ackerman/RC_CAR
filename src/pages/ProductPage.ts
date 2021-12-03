import { WebElement } from "selenium-webdriver";
import { Browser, Button, elementIsVisible, findByClass, findById, Page, pageHasLoaded, WaitCondition, WebComponent } from "../lib";
import { ProductDetails, ProductCard } from "./ProductSearchPage";
import { ShoppingCartPage } from "./ShoppingCartPage";

export class ProductPage extends Page {
	
	private async findProductNameText(browser:Browser): Promise<WebElement>{
		const productNameFields = await browser.findElements({id:"prodName"});

		for (const productNameField of productNameFields){
			const visible = await productNameField.isDisplayed();
			if(visible){
				return productNameField;
			}
		}

		throw Error("Cannot find product name text");
	}

	@findById("addToCartBtn")
	private AddToCardButton: Button;

	@findById("sku")
	private SKU: WebComponent;

	@findByClass("priceBlock")
	private Price: WebComponent;

	private product: ProductCard;
	constructor(protected browser: Browser){
		super(browser);
	}
	
	/**
	 * 
	 * @returns The page is loaded when the Add to Cart button is visible on the page.
	 */
	public loadCondition(): WaitCondition {
		return elementIsVisible(() => this.AddToCardButton);
	}

	/**
	 * 
	 * @param product The product that should be on this page.
	 * @returns 
	 */
	public attachProduct(product: ProductCard): ProductPage{
		this.product = product;
		return this;
	}

	/**
	 * Add the product to the cart by clicking the corresponding button
	 * @returns Return a shopping cart page
	 */
	public async addToCart(): Promise<ShoppingCartPage>{
		await this.AddToCardButton.click();
		await this.browser.wait(pageHasLoaded(ShoppingCartPage));
		return new ShoppingCartPage(this.browser);
	}

	/**
	 * 
	 * @returns Get the product details on this page
	 */
	public async getProductDetails(): Promise<ProductDetails>{
		return new ProductDetails(await (await this.SKU.getText()).split(":")?.pop()?.trim() || "Sku not found", await this.Price.getText(), await (await this.browser.findElement(this.findProductNameText)).getText());
	}

	/**
	 * 
	 * @param product Determine if the product on this page is what should be on this page. 
	 * @returns True if the product that should be on this page matches the product that is on this page.
	 */
	public async hasTheProduct(product:ProductDetails): Promise<boolean>{
		const pageProductDetails = await this.getProductDetails();
		const sameProduct = await pageProductDetails.equalTo(product);
		if(!sameProduct){
			throw Error(`Not the same product. On product page with SKU ${await this.SKU.getText()}, expected ${await this.product.SKU()}`);
		}
		return true;
	}
}