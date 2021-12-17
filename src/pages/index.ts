
import { AccountHomePage } from "./AccountHomePage";
import { AccountSecurityPage } from "./AccountSecurityPage";
import { AccountCreationPage } from "./AccountCreationPage";
import { AccountHelpPage } from "./AccountHelpPage";
import { CheckoutPage } from "./CheckoutPage";
import { GiftCardPage } from "./GiftCardPage";
import { HomePage } from "./HomePage";
import { LoginPage } from "./LoginPage";
import { OrderThanksPage } from "./OrderThanksPage";
import { ProductPage } from "./ProductPage";
import { ProductSearchPage } from "./ProductSearchPage";
import { ShoppingCartPage } from "./ShoppingCartPage";
import { StoreLocationsPage } from "./StoreLocationsPage";
import { StoreMapPage } from "./StoreMapPage";
import { ViewPersonalProfile } from "./ViewPersonalProfile";
import { WishlistPage } from "./WishlistPage";
import { Browser } from "../lib";

export {
	AccountHomePage,
	AccountSecurityPage,
	AccountCreationPage,
	AccountHelpPage,
	CheckoutPage,
	GiftCardPage,
	HomePage,
	LoginPage,
	OrderThanksPage,
	ProductPage,
	ProductSearchPage,
	ShoppingCartPage,
	StoreLocationsPage,
	StoreMapPage,
	ViewPersonalProfile,
	WishlistPage,
};


export class AllPages {
	public accountHomePage: AccountHomePage;
	public accountSecurityPage: AccountSecurityPage;
	public accountCreationPage: AccountCreationPage;
	public accountHelpPage: AccountHelpPage;
	public checkoutPage: CheckoutPage;
	public giftcardPage: GiftCardPage;
	public homePage: HomePage;
	public loginPage: LoginPage;
	public orderThanksPage: OrderThanksPage;
	public productPage: ProductPage;
	public productSearchPage: ProductSearchPage;
	public shoppingCartPage: ShoppingCartPage;
	public storeLocationsPage: StoreLocationsPage;
	public storeMapPage: StoreMapPage;
	public viewPersonalProfilePage: ViewPersonalProfile;
	public wishlistPage: WishlistPage;

	constructor(public browser: Browser){
		this.accountHomePage = new AccountHomePage(browser);
		this.accountSecurityPage = new AccountSecurityPage(browser);
		this.accountCreationPage = new AccountCreationPage(browser);
		this.accountHelpPage = new AccountHelpPage(browser);
		this.checkoutPage = new CheckoutPage(browser);
		this.giftcardPage = new GiftCardPage(browser);
		this.homePage = new HomePage(browser);
		this.loginPage = new LoginPage(browser);
		this.orderThanksPage = new OrderThanksPage(browser);
		this.productPage = new ProductPage(browser);
		this.productSearchPage = new ProductSearchPage(browser);
		this.shoppingCartPage = new ShoppingCartPage(browser);
		this.storeLocationsPage = new StoreLocationsPage(browser);
		this.storeMapPage = new StoreMapPage(browser);
		this.viewPersonalProfilePage = new ViewPersonalProfile(browser);
		this.wishlistPage = new WishlistPage(browser);
	}
}