import { Button, findById, TextInput, urlContainsValue, WaitCondition, WebComponent } from "../lib";
import { Page } from "../components/page";
import { IBrowser } from "../interfaces/IBrowser";
import { ProductDetails } from "./ProductSearchPage";
import { WebElement } from "selenium-webdriver";

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

	public async getOrder(orderNumber: string){
		const allOrders = await this.getOrders();
		for(const order of allOrders){
			const num = await order.getOrderNumber();
			if(num == orderNumber){
				return order;
			}
		}
	}

	public async getOrders(){
		const orderHeaders = await this.orderContainer.findElements({css:"a[class='pt2x cb grid-full']"});
		const orderTables = await this.orderContainer.findElements({xpath:".//table"});

		const orders = [];
		for(let i=0; i < orderHeaders.length; i++){
			orders.push(new Order(orderHeaders[i], orderTables[i]));
		}
		return orders;
	}	

	public async searchOrders(searchTerm:string){
		await this.searchBox.type(searchTerm);
		await this.searchButton.click();
	}

	public loadCondition(): WaitCondition {
		return urlContainsValue(this.browser, "Recent-Activity");
	}
}

class Order {
	
	constructor(private orderHeader: WebElement, private orderTable: WebElement){	}

	public async getOrderNumber(){
		const orderNumElement = await this.orderHeader.findElement({css:"span"});
		return orderNumElement.getText();
	}

	public async getOrderItems(){
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

	public async containsItem(item: ProductDetails){
		const orderItems = await this.getOrderItems();
		for(const orderItem of orderItems){
			if(orderItem.equalTo(item)){
				return true;
			}
		}
		return false;
	}

	public async getOrderTotal(){
		const tableRows = await this.orderTable.findElements({css:"tr"});
		const total = tableRows.at(-2);
		return total?.getText() || Number.MAX_SAFE_INTEGER;
	}

	public async getTotalAmountPaid(){
		const tableRows = await this.orderTable.findElements({css:"tr"});
		const paid = tableRows.at(-1);
		return paid?.getText() || Number.MAX_SAFE_INTEGER;
	}
}
