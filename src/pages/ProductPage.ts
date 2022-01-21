import { WebElement } from "selenium-webdriver";
import { Browser, Button, elementIsVisible, findByClass, findById, WaitCondition, WebComponent } from "../lib";
import { ProductCard } from "./ProductSearchPage";
import { Page } from "../partials/page";
import { ProductDetails } from "../types/ProductDetails";

export class ProductPage extends Page {
	
	/**
	 * This is required because there are multple prodName elements,
	 * as thus we have to find a visible one.
	 * @param browser 
	 * @returns 
	 */
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
	private addToCartButton: Button;

	@findById("sku")
	private sku: WebComponent;

	@findByClass("priceBlock")
	private price: WebComponent;

	@findByClass("wishlistActionItem")
	private wishlistAddButton: Button;

	private product: ProductCard;
	constructor(protected browser: Browser){
		super(browser);
	}
	
	/**
	 * @returns The page is loaded when the Add to Cart button is visible on the page.
	 */
	public loadCondition(): WaitCondition {
		return elementIsVisible(() => this.addToCartButton);
	}

	/**
	 * @param product The product that should be on this page.
	 * @returns This product page.
	 */
	public attachProduct(product: ProductCard): ProductPage{
		this.product = product;
		return this;
	}

	/**
	 * Add the product to the cart by clicking the corresponding button
	 * @returns should change the page to the shopping cart page.
	 */
	public async addToCart(): Promise<void>{
		await this.addToCartButton.click();
	}

	/**
	 * @returns Get the product details on this page
	 */
	public async getProductDetails(): Promise<ProductDetails>{
		const sku = await (await this.sku.getText()).split(":").pop()?.trim() || "Sku not found";
		const price = await this.price.getText();
		const name = await this.browser.findElement(this.findProductNameText).getText();
		return new ProductDetails(sku, price, name);
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
			throw Error(`Not the same product. Product on page has SKU ${await this.sku.getText()}, expected ${await this.product.sku()}`);
		}
		return true;
	}


	/**
	 * A this product to a wishlist
	 * @param wishlistName The wishlist to add to
	 * @returns The wishlist that was selected
	 */
	public async addProductToWishlist(wishlistName: string): Promise<string>{
		await this.browser.wait(elementIsVisible(()=>this.wishlistAddButton));
		await this.browser.sleep(1);
		await this.wishlistAddButton.click();
		const possibleWishlists = await this.browser.findElements({css:"a[class~='icon-heart']"});
		for(const wishlist of possibleWishlists){
			const text = await wishlist.getText();
			if(text.includes(wishlistName)){
				await wishlist.click();
				return text;
			}
		}
		throw new Error("Could not find wishlist");
	}
}