
import { AllPages } from "../src/pages";
import { Browser } from "../src/lib";
import { SupportedBrowsers, time } from "../config";
import { snapshot } from "../src/lib";

import chai = require("chai"); 
import chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

require("chromedriver");

/**
 * A smoke test suite to ensure basic site functionality 
 * is operational.
 */
describe("The wishlist page", () => {  

	let browser: Browser;
	let pages: AllPages;
	/**
	 * Before all tests are run
	 */
	beforeEach(async () => {
		browser = await new Browser(SupportedBrowsers.Chrome);
		pages = new AllPages(browser);
	});

	it("Allows products to be added from a wish list", async () => {
		await pages.homePage.navigate();
		await pages.homePage.header.searchForItem("");
		const products = await pages.productSearchPage.findAllProductsOnPage();
		const firstProduct = products[0];
		const productDetails = await firstProduct.getProductDetails();	
		await pages.productSearchPage.selectProduct(firstProduct);
		await pages.productPage.addProductToWishlist("Add to Wish List");
		const productAvailable = await pages.wishlistPage.checkProductIsInWishlist(productDetails);
		expect(productAvailable).to.be.true;
	});

	it("Allows products to be removed from a wish list", async () => {
		await pages.homePage.navigate();
		await pages.homePage.header.searchForItem("");
		const products = await pages.productSearchPage.findAllProductsOnPage();
		const firstProduct = products[0];
		const productDetails = await firstProduct.getProductDetails();	
		
		await pages.productSearchPage.selectProduct(firstProduct);
		await pages.productPage.addProductToWishlist("Add to Wish List");
		await pages.wishlistPage.removeProductFromWishlist(productDetails);
		await browser.wait(() => pages.wishlistPage.wishlistIsEmpty(), time.TenSeconds, "Wish List was not empty in time");
		expect(pages.wishlistPage.wishlistIsEmpty()).to.eventually.be.true;
	});

	it("Allows wishlist items to be added to the cart", async () => {
		await pages.homePage.navigate();
		await pages.homePage.header.searchForItem("");
		
		const products = await pages.productSearchPage.findAllProductsOnPage();
		const firstProduct = products[0];
		const productDetails = await firstProduct.getProductDetails();	
		
		await pages.productSearchPage.selectProduct(firstProduct);
		await pages.productPage.addProductToWishlist("Add to Wish List");
		await pages.wishlistPage.addWishlistItemToCart(productDetails);
		expect(pages.shoppingCartPage.cartContainsProduct(productDetails)).to.eventually.be.true;
	});

	/** 
	 * After all tests are run
	 */
	afterEach(async function () {

		//Check if the test that just ran was not successful
		if(this.currentTest?.state !== "passed"){
			snapshot(this, browser);
		}
		await browser.close();
	});
});
