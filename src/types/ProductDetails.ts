/**
 * This class is useful in comparing products across different representations. 
 * Wishlist items, cartitems, product pages, product search. They all usually have 
 * the name, price, and sku available. 
 */
export class ProductDetails {
	constructor(public sku:string, public price:string, public productName: string){}

	public equalTo(other: ProductDetails){
		return this.sku === other.sku && this.price === other.price && this.productName === other.productName;
	}
}