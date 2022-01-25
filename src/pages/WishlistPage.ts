import { WebElement } from "selenium-webdriver";
import { Browser, Button, componentIsVisible, findByCSS, findById, urlContainsValue, WaitCondition, WebComponent } from "../lib";
import { Page } from "../partials/page";
import { ProductDetails } from "../types/ProductDetails";

/**
 * Defines important data the a wishlist item has. Useful when passing objects of data around.
 */
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
	private productNameText: WebComponent;

	@findByCSS("div[class~='prodInfo']")
	private productInfoText: WebComponent;

	@findByCSS("a[class~='icon-cart']")
	public moveToCartButton: Button;

	//Find by needs a local browser element, so for now we need one.
	private browser;

	constructor(private element: WebElement)
	{
		this.browser = element;
	}

	/**
	 * @returns The wishlist product name
	 */
	private async productName(): Promise<string>{
		try{
			return await this.productNameText.getText();
		}catch(error){
			throw new Error(`Error getting wishlist item's product name because of ${error}`);
		}
	}

	/**
	 * @returns The wishlist product info
	 */
	private async productInfo(): Promise<string>{
		try{
			return await this.productInfoText.getText();
		}catch(error){
			throw new Error(`Error getting wishlist item's product info because of ${error}`);
		}
	}

	/**
	 * @returns A wishlist item's product details.
	 */
	public async productDetails(): Promise<WishListDetails>{
		try{
			const name = await this.productName();
			const info = await this.productInfo();
			return {productName:name, productInfo:info};
		} catch(error){
			throw new Error(`Error getting wish list product details because of ${error}`);

		}
	}

	/**
	 * Remove this wishlist item from the wish list.
	 */
	public async deleteItem(): Promise<void>{
		const trashcanBtn = new Button(this.element.findElement({className:"removeItemBtn"}), "removeItemBtn");
		await trashcanBtn.click();
	}
}

/**
 * The wishlist page.
 */
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
	}

	/**
	 * Determines if the wishlist is empty
	 * @returns True if empty, otherwise false. 
	 */
	public async wishlistIsEmpty(): Promise<boolean>{
		const emptyCartElement = await this.browser.findElement({id:"emptyCart"});
		if(await emptyCartElement.isDisplayed()){
			return true;
		}
		return false;
	}

	/**
	 * Get a list of wishlist items in the wishlist
	 * Filters out the first wishlist item, as its assumed to be the membership advertisement.
	 * @returns All wishlist items.
	 * @throws An error if there are no wishlist items on the page.
	 */
	public async getWishlistItems(): Promise<Array<WishListItem>>{
		await this.browser.wait(componentIsVisible(() => this.shoppingCart));
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

	/**
	 * See if a product is in the wishlist
	 * @param product The product details of the product to search for.
	 * @returns True if present, false otherwise.
	 */
	public async checkProductIsInWishlist(product:ProductDetails): Promise<boolean>{
		const items = await this.getWishlistItems();
		for(const item of items){
			const wishlistProductName = (await item.productDetails()).productName;
			if(product.productName === wishlistProductName){
				return true;
			}
		}
		return false;
	}		

	/**
	 * Remove a product from the wishlist
	 * @param product The product to remove
	 * @returns Return the product details of a successfully removed product.
	 * @throws An error if no item is deleted from the wishlist.
	 */
	public async removeProductFromWishlist(product:ProductDetails): Promise<WishListItem>{
		const items = await this.getWishlistItems();
		for(const item of items){
			const itemDetails = await item.productDetails();
			if(product.productName == itemDetails.productName){
				await item.deleteItem();
				return item;
			}
		}
		throw new Error(`Product: ${product.productName} was not found in wishlist to delete`);
	}

	/**
	 * Add a wislist item to the cart
	 * @param product The product to add to the cart
	 * @returns The item if successful
	 * @throws An error if the wanted product is not present in the wishlist.
	 */
	public async addWishlistItemToCart(product:ProductDetails): Promise<WishListItem>{
		const items = await this.getWishlistItems();
		for(const item of items){
			const itemsDetails = await item.productDetails();
			if(product.productName == itemsDetails.productName){
				await item.moveToCartButton.click();
				return item;
			}
		}
		throw new Error(`Could not add ${product.productName} from wishlist to shopping cart page`);
	}
}