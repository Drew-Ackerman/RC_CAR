
import { HomePage } from "../src/pages";
import { Browser } from "../src/lib";
import { SupportedBrowsers } from "../config";
import { snapshot } from "../src/lib/snapshot";

import chai = require("chai"); 
import chaiAsPromised = require("chai-as-promised");
import { WishlistPage } from "../src/pages/WishlistPage";
chai.use(chaiAsPromised);
const expect = chai.expect;

require("chromedriver");

/**
 * A smoke test suite to ensure basic site functionality 
 * is operational.
 */
describe("The wishlist page", () => {  

	let browser: Browser;

	/**
	 * Before all tests are run
	 */
	beforeEach(async () => {
		browser = await new Browser(SupportedBrowsers.Chrome);
	});

	it("Allows products to be added from a wish list", async () => {
		const homePage = new HomePage(browser);
		await homePage.navigate();
		const productSearchPage = await homePage.header.searchForItem("");
		const products = await productSearchPage.findAllProductsOnPage();
		const firstProduct = products[0];
		const productDetails = await firstProduct.getProductDetails();	
		const productPage = await productSearchPage.selectProduct(firstProduct);
		const wishlistPage = await productPage.addProductToWishlist("Add to Wish List") as WishlistPage;
		const productAvailable = await wishlistPage.checkProductIsInWishlist(productDetails);
		expect(productAvailable).to.be.true;
	});

	it("Allows products to be removed from a wish list", async () => {
		const homePage = new HomePage(browser);
		await homePage.navigate();
		const productSearchPage = await homePage.header.searchForItem("");
		const products = await productSearchPage.findAllProductsOnPage();
		const firstProduct = products[0];
		const productDetails = await firstProduct.getProductDetails();	
		const productPage = await productSearchPage.selectProduct(firstProduct);
		const wishlistPage = await productPage.addProductToWishlist("Add to Wish List") as WishlistPage;
		await wishlistPage.removeProductFromWishlist(productDetails);
		await browser.wait(() => wishlistPage.wishlistIsEmpty(), 10, "Wish List was not empty in time");
		expect(wishlistPage.wishlistIsEmpty()).to.eventually.be.true;
	});

	it("Allows wishlist items to be added to the cart", async () => {
		const homePage = new HomePage(browser);
		await homePage.navigate();
		const productSearchPage = await homePage.header.searchForItem("");
		const products = await productSearchPage.findAllProductsOnPage();
		const firstProduct = products[0];
		const productDetails = await firstProduct.getProductDetails();	
		const productPage = await productSearchPage.selectProduct(firstProduct);
		const wishlistPage = await productPage.addProductToWishlist("Add to Wish List") as WishlistPage;
		const shoppingCartPage = await wishlistPage.addWishlistItemToCart(productDetails);
		expect(shoppingCartPage.cartContainsProduct(productDetails)).to.eventually.be.true;
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
