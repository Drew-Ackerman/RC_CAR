
export interface ProductDetails {
	productName:string,
	productInfo:string,
	equalTo(product:ProductDetails):boolean,
}