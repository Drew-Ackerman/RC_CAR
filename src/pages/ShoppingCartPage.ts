import { WebElement } from "selenium-webdriver";
import { Browser, Button, elementIsVisible, findByClass, pageHasLoaded, urlContainsValue, WaitCondition, WebComponent } from "../lib";
import { CheckoutPage } from "./CheckoutPage";
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
	 * @returns A promise to the checkout page
	 */
	public async Checkout(): Promise<CheckoutPage> {
		const checkoutButton = new Button(this.browser.findElement(this.findCheckoutButton), "function");
		await this.browser.wait(elementIsVisible(()=>checkoutButton));
		await checkoutButton.click();
		await this.browser.wait(pageHasLoaded(CheckoutPage));
		await this.browser.sleep(2);
		return new CheckoutPage(this.browser);
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