import { WebElement } from "selenium-webdriver";
import { Browser, Button, elementIsVisible, findByCSS, findById, urlContainsValue, WaitCondition, WebComponent } from "../lib";
import { ProductDetails } from "./ProductSearchPage";
import { Page } from "../components/page";

export type WishListDetails = {
	productName:string,
	productInfo:string,
}

/**
 * A wishlist is composed of individual items. 
 * This class represents one of those items. 
 */
export class WishListItem{
	@findByCSS("a[class~='prodName']")
	private ProductNameText: WebComponent;

	@findByCSS("div[class~='prodInfo']")
	private productInfoText: WebComponent;

	@findByCSS("a[class~='icon-cart']")
	public moveToCartButton: Button;

	//Find by is needs a local browser element, so for now we need one.
	private browser;

	constructor(private element: WebElement)
	{
		this.browser = element;
	}

	public async ProductName(): Promise<string>{
		try{
			return await this.ProductNameText.getText();
		}catch(error){
			console.error("Error getting wish list product name", error);
			throw error;
		}
	}

	public async ProductInfo(): Promise<string>{
		try{
			return await this.productInfoText.getText();
		}catch(error){
			console.error("Error gettting wish list item product info", error);
			throw error;
		}
	}

	public async productDetails(): Promise<WishListDetails>{
		try{
			const name = await this.ProductName();
			const info = await this.ProductInfo();
			return {productName:name, productInfo:info};
		} catch(error){
			console.error(error);
			throw error;
		}
	}

	public async deleteItem(): Promise<void>{
		const trashcanBtn = new Button(this.element.findElement({className:"removeItemBtn"}), "removeItemBtn");
		await trashcanBtn.click();
	}
}

export class WishlistPage extends Page {
	
	@findById("shoppingCart")
	private shoppingCart: WebComponent;

	@findById("cartHeader")
	private shoppingCartHeader: WebComponent;

	constructor(browser:Browser){
		super(browser);

	}
	
	public loadCondition(): WaitCondition {
		return urlContainsValue(this.browser, "Shopping-Cart?listName=");
		//return elementIsVisible(()=>this.shoppingCartHeader);
	}

	public async wishlistIsEmpty(): Promise<boolean>{
		const el = await this.browser.findElement({id:"emptyCart"});
		if(await el.isDisplayed()){
			return true;
		}
		return false;
	}

	public async getWishlistItems(): Promise<Array<WishListItem>>{
		await this.browser.wait(elementIsVisible(() => this.shoppingCart));
		const items = await this.shoppingCart.findElements({css:"div[class~='cartItem']"});
		if(items.shift() == undefined){
			throw new Error("No wish list items");
		}
		const wishlistItems = items.map((item) => {
			const wli = new WishListItem(item);
			return wli;
		});		
		return wishlistItems;
	}

	public async checkProductIsInWishlist(product:ProductDetails): Promise<boolean>{
		const items = await this.getWishlistItems();
		for(let i = 0; i < items.length; i++){
			const wishlistProductName = (await items[i].productDetails()).productName;
			if(product.productName === wishlistProductName){
				return true;
			}
		}
		return false;
	}		

	public async removeProductFromWishlist(product:ProductDetails): Promise<void>{
		const items = await this.getWishlistItems();
		for(let i=0; i < items.length; i++){
			const itemDetails = await items[i].productDetails();
			if(product.productName == itemDetails.productName){
				await items[i].deleteItem();
				return;
			}
		}
		throw new Error(`Product: ${product.productName} was not found in wishlist to delete`);
	}

	public async addWishlistItemToCart(product:ProductDetails): Promise<void>{
		const items = await this.getWishlistItems();
		for(let i=0; i < items.length; i++){
			const itemsDetails = await items[i].productDetails();
			if(product.productName == itemsDetails.productName){
				await items[i].moveToCartButton.click();
				return;
			}
		}
		throw new Error(`Could not add ${product.productName} from wishlist to shopping cart page`);
	}
}