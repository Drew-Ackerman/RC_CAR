import { WebElement } from "selenium-webdriver";
import { Browser, Button, findByClass, findById, findByLinkText, Page, pageHasLoaded, urlContainsValue, WaitCondition, WebComponent } from "../lib";
import { ProductDetails } from "./ProductSearchPage";
import { ShoppingCartPage } from "./ShoppingCartPage";

export type WishListDetails = {
	productName:string,
	productInfo:string,
}

export class WishListItem{
	@findByClass("prodName")
	private ProductNameText: WebComponent;

	@findByClass("prodInfo")
	private productInfoText: WebComponent;

	@findByLinkText("Move to Cart")
	public moveToCartButton: Button;

	constructor(private element: WebElement){}

	public async ProductName(): Promise<string>{
		return await this.ProductNameText.getText();
	}

	public async ProductInfo(): Promise<string>{
		return await this.productInfoText.getText();
	}

	public async productDetails(): Promise<WishListDetails>{
		const name = await this.ProductName();
		const info = await this.ProductInfo();
		return {productName:name, productInfo:info};
	}

	public async deleteItem(): Promise<void>{
		const trashcanBtn = new Button(this.element.findElement({className:"removeItemBtn"}), "removeItemBtn");
		await trashcanBtn.click();
	}
}

export class WishlistPage extends Page {
	
	@findById("shoppingCart")
	private ShoppingCart: WebComponent;

	constructor(browser:Browser){
		super(browser);

	}
	
	public loadCondition(): WaitCondition {
		return urlContainsValue(this.browser, "Shopping-Cart?listName=");
	}

	public async wishlistIsEmpty(): Promise<boolean>{
		try{
			const el = await this.browser.findElement({id:"empytyCart"});
			if(await el.isDisplayed()){
				return true;
			}
			return false;
		} catch(error){
			return false;
		}
	}

	public async getWishlistItems(): Promise<Array<WishListItem>>{
		const items = await this.ShoppingCart.findElements({css:"cartItem"});
		const wishlistItems = items.map((item) => {
			return new WishListItem(item);
		});		
		return wishlistItems;
	}

	public async checkProductIsInWishlist(product:ProductDetails): Promise<boolean>{
		const items = await this.getWishlistItems();
		const wishlistDetails = await items.map(async (wli) => {
			return await wli.productDetails();
		});
		wishlistDetails.forEach(async (wld) => {
			if(product.productName == (await wld).productName){
				return true;
			}
		});
		return false;
	}		

	public async removeProductFromWishlist(product:ProductDetails): Promise<void>{
		const items = await this.getWishlistItems();
		items.forEach(async (item) => {
			const itemDetails = await item.productDetails();
			if(product.productName == itemDetails.productName){
				await item.deleteItem();
			}
		});
		throw new Error(`Product: ${product.productName} was not found in wishlist to delete`);
	}

	public async addWishlistItemToCart(product:ProductDetails): Promise<ShoppingCartPage>{
		const items = await this.getWishlistItems();
		items.forEach(async (item) => {
			const itemsDetails = await item.productDetails();
			if(product.productName == itemsDetails.productName){
				await item.moveToCartButton.click();
				await this.browser.wait(pageHasLoaded(ShoppingCartPage));
				return new ShoppingCartPage(this.browser);
			}
		});
		throw new Error(`Could not add ${product.productName} from wishlist to shopping cart page`);
	}
}