import { WebElement } from "selenium-webdriver";
import { Browser, componentIsVisible, findByClass, findById, urlContainsValue, WaitCondition, WebComponent } from "../lib";
import { Page } from "../partials/page";
import { ProductDetails } from "../types/ProductDetails";

/**
 * An item in the shopping cart. 
 */
export class CartItem {

	@findByClass("prodName")
	private productNameText: WebComponent;

	@findByClass("prodInfo")
	private productInfoText:WebComponent;

	protected browser; //Required to make the findBy function correctly.
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

/**
 * Page Object Model for the shopping cart page.
 */
export class ShoppingCartPage extends Page {
	
	private async findCheckoutButton(browser: Browser){
		const buttons = await browser.findElements({css:"a[href='/Proceed-To-Checkout']"});
		for(let i = 0; i < buttons.length; i++){
			const displayed = await buttons[i].isDisplayed();
			if(displayed){
				return buttons[i];
			}
		}
		throw new Error("Couldnt find a visible checkout button");
	}

	@findById("shoppingCart")
	private shoppingCart: WebComponent;

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
	public async checkout(): Promise<void> {
		const checkoutButton = await this.browser.findElement(this.findCheckoutButton);
		await checkoutButton.click();
	}

	/**
	 * The shopping cart can contain a cart item that is just
	 * a blue rewards advertisement, remove that cart item. 
	 * @param cartItems 
	 * @returns Cart items with the blue rewards item removed. 
	 */
	private async filterOutBlueRewardsCartItem(cartItems: Array<CartItem>){
		const filteredArray = [];
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
		await this.browser.wait(componentIsVisible(() => this.shoppingCart));
		const cartItemElements = await this.shoppingCart.findElements({className:"cartItem"});
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