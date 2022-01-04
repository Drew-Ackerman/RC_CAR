import { WebElement } from "selenium-webdriver";
import { Browser, Button, elementIsVisible, findByClass, findById, urlContainsValue, WaitCondition, WebComponent } from "../lib";
import { ProductDetails } from "./ProductSearchPage";
import { Page } from "../components/page";

export class CartItem {

	@findByClass("prodName")
	private ProductNameText: WebComponent;

	@findByClass("prodInfo")
	private productInfoText:WebComponent;

	constructor(private element: WebElement){}

	public async ProductName(): Promise<string>{
		return await this.ProductNameText.getText();
	}

	public async ProductInfo(): Promise<string>{
		return await this.productInfoText.getText();
	}

	public async equalTo(productInfo: ProductDetails){
		return await this.ProductName() === productInfo.productName;
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

	public async getCartItems(): Promise<Array<CartItem>>{
		const shoppingCart = await this.browser.findElement({id:"shoppingCart"});
		const cartItemElements = shoppingCart.findElements({className:"cartItem"});
		return (await cartItemElements).map((itemElement) => {
			return new CartItem(itemElement);
		});		
	}

	public async cartContainsProduct(product:ProductDetails){
		const cartItems = await this.getCartItems();
		cartItems.forEach(async (cartItem)=> {
			if(await cartItem.equalTo(product)){
				return true;
			}
		});
		return false;
	}
	
}