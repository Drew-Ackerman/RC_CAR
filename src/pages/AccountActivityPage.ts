import { Button, findById, TextInput, urlContainsValue, WaitCondition, WebComponent } from "../lib";
import { Page } from "../partials/page";
import { IBrowser } from "../interfaces/IBrowser";
import { WebElement } from "selenium-webdriver";
import { ProductDetails } from "../types/ProductDetails";

/**
 * The page that shows a users most recent purchases.
 */
export class AccountActivityPage extends Page{

	@findById("historyContainer")
	private orderContainer: WebComponent;

	@findById("searchActivityBox")
	private searchBox: TextInput;

	@findById("searchActivityButton")
	private searchButton: Button;

	constructor (browser:IBrowser){
		super(browser);
	}

	/**
	 * Grab a specific order from a list of available orders. 
	 * @param orderNumber The ordernumber for the wanted order.
	 * @returns The order if it is available
	 * @throws An error if the order is not present
	 */
	public async getOrder(orderNumber: number): Promise<Order>{
		const allOrders = await this.getOrders();
		for(const order of allOrders){
			const num = await order.getOrderNumber();
			if(num == orderNumber){
				return order;
			}
		}
		throw new Error(`Order with ${orderNumber} is not present`);
	}

	/**
	 * Grab all orders on the page
	 * @returns A list of present {@link Order}s 
	 */
	public async getOrders(): Promise<Array<Order>>{
		const orderHeaders = await this.orderContainer.findElements({css:"a[class='pt2x cb grid-full']"});
		const orderTables = await this.orderContainer.findElements({xpath:".//table"});

		const orders:Array<Order> = [];
		orderHeaders.forEach((header, index) => {
			const table = orderTables[index];
			const order = new Order(header, table);
			orders.push(order);
		});
		return orders;
	}	

	/**
	 * Filter the orders based off the searchTerm
	 * @param searchTerm What to look for in the orders
	 */
	public async searchOrders(searchTerm:string): Promise<void>{
		await this.searchBox.type(searchTerm);
		await this.searchButton.click();
	}

	public loadCondition(): WaitCondition {
		return urlContainsValue(this.browser, "Recent-Activity");
	}
}

/**
 * Represents an order. The order number, the order items, the total price.
 */
class Order {
	
	constructor(private orderHeader: WebElement, private orderTable: WebElement){	}

	/**
	 * @returns The order's order number
	 */
	public async getOrderNumber(): Promise<number>{
		const orderNumElement = await this.orderHeader.findElement({css:"span"});
		const orderText = await orderNumElement.getText();
		const splits = await orderText.split(" ");
		const orderNumber = splits.pop();
		return Number(orderNumber);
	}

	/**
	 * Each item in the order is converted into product details
	 * @returns A collection of product details. 
	 */
	public async getOrderItems(): Promise<Array<ProductDetails>>{
		const tableRows = await this.orderTable.findElements({css:"tr"});
		const rows = tableRows.slice(1,-2);
		
		const orderItems = [];
		for(const row of rows){
			const columns = await row.findElements({css:"td"});
			const name = await columns.at(1)?.getText() || "No product available";
			const sku = await columns.at(2)?.getText() || "No sku available";
			const price = await columns.at(4)?.getText() || "No price available";
			orderItems.push(new ProductDetails(sku, price, name));
		}
		return orderItems;
	}

	/**
	 * Determine if theres a specific item in the order.
	 * @param item 
	 * @returns True if present, false otherwise.
	 */
	public async containsItem(item: ProductDetails): Promise<boolean>{
		const orderItems = await this.getOrderItems();
		for(const orderItem of orderItems){
			if(orderItem.equalTo(item)){
				return true;
			}
		}
		return false;
	}

	/**
	 * @returns The orders total price.
	 */
	public async getOrderTotal(){
		const tableRows = await this.orderTable.findElements({css:"tr"});
		const total = tableRows.at(-2);
		return total?.getText() || Number.MAX_SAFE_INTEGER;
	}

	/**
	 * @returns The total amount paid to the order.
	 */
	public async getTotalAmountPaid(){
		const tableRows = await this.orderTable.findElements({css:"tr"});
		const paid = tableRows.pop();
		return paid?.getText() || Number.MAX_SAFE_INTEGER;
	}
}
