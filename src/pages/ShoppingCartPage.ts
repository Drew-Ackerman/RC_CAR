import { WebElement } from "selenium-webdriver";
import { Browser, Button, elementIsVisible, findByClass, findById, urlContainsValue, WaitCondition, WebComponent } from "../lib";
import { ProductDetails } from "./ProductSearchPage";
import { Page } from "../components/page";

export class CartItem {

	@findByClass("prodName")
	private productNameText: WebComponent;

	@findByClass("prodInfo")
	private productInfoText:WebComponent;

	private browser;
	constructor(public element: WebElement){
		this.browser = element;
	}

	public async productName(): Promise<string>{
		return await this.productNameText.getText();
	}

	public async productInfo(): Promise<string>{
		return await this.productInfoText.getText();
	}

	public async equalTo(productInfo: ProductDetails){
		return await this.productName() === productInfo.productName;
	}
}

export class ShoppingCartPage extends Page {
	
	@findById("checkoutButton")
	private checkoutButton: Button

	constructor(protected browser:Browser){
		super(browser);
	}

	/**
	 * This POM is loaded when the url contains 'Shopping-Cart'
	 * @returns 
	 */
	public loadCondition(): WaitCondition {
		return urlContainsValue(this.browser, "Shopping-Cart");
	}

	/**
	 * Checkout the product
	 * Page should change to the checkout page
	 */
	public async Checkout(): Promise<void> {
		await this.browser.wait(elementIsVisible(()=>this.checkoutButton));
		await this.checkoutButton.click();
	}

	/**
	 * The shopping cart can contain a cart item that is just
	 * a blue rewards advertisement, remove that cart item. 
	 * @param cartItems 
	 * @returns Cart items with the blue rewards item removed. 
	 */
	private async filterOutBlueRewardsCartItem(cartItems: Array<CartItem>){
		let filteredArray = [];
		for(const cartItem of cartItems){
			try{
				await cartItem.element.findElement({className:"blue-rewards-container"});
			}
			catch(error){
				filteredArray.push(cartItem);
			}
		}
		return filteredArray;
	}

	/**
	 * @returns Get all valid {@link CartItem}s in the cart
	 */
	public async getCartItems(): Promise<Array<CartItem>>{
		const shoppingCart = await this.browser.findElement({id:"shoppingCart"});
		const cartItemElements = await shoppingCart.findElements({className:"cartItem"});
		const cartItems = cartItemElements.map((itemElement) => {
			return new CartItem(itemElement);
		});	
		return this.filterOutBlueRewardsCartItem(cartItems);	
	}

	/**
	 * Determine if the cart contains a product
	 * @param product 
	 * @returns True if it does, false if it doesnt. 
	 */
	public async cartContainsProduct(product:ProductDetails){
		const cartItems = await this.getCartItems();
		for (const cartItem of cartItems){
			if(await cartItem.equalTo(product)){
				return true;
			}
		}
		return false;
	}
	
}