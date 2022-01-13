import { WebElement } from "selenium-webdriver";
import { Browser, Button, elementIsVisible, findByClass, findById, WaitCondition, WebComponent } from "../lib";
import { ProductDetails, ProductCard } from "./ProductSearchPage";
import { Page } from "../components/page";

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
	private AddToCardButton: Button;

	@findById("sku")
	private SKU: WebComponent;

	@findByClass("priceBlock")
	private Price: WebComponent;

	@findByClass("wishlistActionItem")
	private WishlistAddButton: Button;

	private product: ProductCard;
	constructor(protected browser: Browser){
		super(browser);
	}
	
	/**
	 * @returns The page is loaded when the Add to Cart button is visible on the page.
	 */
	public loadCondition(): WaitCondition {
		return elementIsVisible(() => this.AddToCardButton);
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
		await this.AddToCardButton.click();
	}

	/**
	 * @returns Get the product details on this page
	 */
	public async getProductDetails(): Promise<ProductDetails>{
		const sku = await (await this.SKU.getText()).split(":").pop()?.trim() || "Sku not found";
		const price = await this.Price.getText();
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
			throw Error(`Not the same product. On product page with SKU ${await this.SKU.getText()}, expected ${await this.product.SKU()}`);
		}
		return true;
	}


	public async addProductToWishlist(wishlistName: string): Promise<void>{
		await this.browser.wait(elementIsVisible(()=>this.WishlistAddButton));
		await this.browser.sleep(1);
		await this.WishlistAddButton.click();
		const possibleWishlists = await this.browser.findElements({css:"a[class~='icon-heart']"});
		for(let i=0; i < possibleWishlists.length;i++){
			const text = await possibleWishlists[i].getText();
			if(text.includes(wishlistName)){
				await possibleWishlists[i].click();
				return;
			}
		}
		throw new Error("Could not find wishlist");
	}
}