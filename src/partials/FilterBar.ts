import { WebElement } from "selenium-webdriver";
import { FilterOptionError } from "../exceptions/FilterOptionError";
import { IBrowser } from "../interfaces/IBrowser";
import { componentIsVisible } from "../lib";
import { Button, Checkbox, WebComponent } from "../lib/components";
import { findByClass, findByCSS, findById } from "../lib/utils";

/**
 * The filter bar is used in the product search page
 * to filter search results. 
 */
export class FilterBar {

	@findById("browseSidebar")
	private container: WebComponent;

	protected browser; //Required to make the findBy function correctly.
	constructor(protected element: IBrowser){
		this.browser = element;
	}

	/**
	 * Select any text filter, that is, a checkbox with text next to it. 
	 * This method will troll through all text filter groups and check each
	 * for the wanted filter.
	 * @param filterOption What filter to apply. 
	 * @returns 
	 */
	public async selectTextFilterOption(filterOption: string){
		const filterGroups = await this.getFilterGroups();
		for(const filterGroup of filterGroups){
			if(filterGroup instanceof TextFilterGroup){
				const selectedOption = await filterGroup.selectTextFilterOption(filterOption);
				if(selectedOption !== undefined){
					return selectedOption;
				}
			}
		}
	}

	/**
	 * Filter products off of the customer review system. 
	 * @param option The review star option
	 */
	public async selectCustomerReviewFilterOption(option: CustomerReviewFilterOptions){
		const filterGroups = await this.getFilterGroups();
		for(const group of filterGroups){
			if(group instanceof CustomerReviewFilterGroup){
				group.selectReview(option);
			}
		}
	}

	/**
	 * Get every filter group of every filter group type. 
	 * @returns A collection of found filter groups. 
	 */
	public async getFilterGroups(){
		const filterGroups = [];

		const groups = await this.container.findElements({className: "filterGroup"});
		for(const group of groups){
			const headerText = await group.findElement({className:"header"}).getText();

			if(headerText.toLowerCase().includes("price range")){
				filterGroups.push(new PriceFilterGroup(group));
			}
			else if(headerText.toLowerCase().includes("average customer review")){
				filterGroups.push(new CustomerReviewFilterGroup(group));
			}
			else{
				filterGroups.push(new TextFilterGroup(group));
			}
		}
		return filterGroups;
	}

	public async waitTillVisible(){
		await this.browser.wait(componentIsVisible(()=>this.container));
	}
}

/**
 * Every filter group extends off of this class.
 * A filter group is a collection of filters that can be used to 
 * reduce the search results on the product search page.
 */
class FilterGroup {
	@findByClass("header")
	protected filterGroupName: WebComponent;

	@findByClass("icon-left-wedge")
	protected expandButton: WebComponent;

	@findByClass("rowToggleChild")
	protected filterOptionsContainer: WebComponent;

	@findByClass("filtervalues")
	private filterValuesContainer: WebComponent;

	protected browser; //Required to make the findBy function correctly.
	constructor(protected element: WebElement){
		this.browser = element;
	}

	/**
	 * Gets the name of the filter group.
	 * @returns The name of the filter group.
	 */
	public name(){
		return this.filterGroupName.getText();
	}

	/**
	 * Determines if the filter group has been expanded or if
	 * it remains collapsed and hidden.
	 * 
	 * Aria-hidden will be false if nothing is hidden, true if it is hidden.
	 * @returns True if group is expanded, false otherwise.
	 */
	public async isExpanded(){
		const val = await this.filterValuesContainer.getAttribute("aria-hidden");
		return val === "false";
	}

	/**
	 * Expand the filter group.
	 */
	public expandFilterGroup(){
		return this.expandButton.click();
	}

	/**
	 * Collapse the filter group.
	 */
	public collapseFilterGroup(){
		return this.expandButton.click();
	}
}

/**
 * For working with text filter groups in the filter section of 
 * the product search page. A text filter group is something like "brand", or "color".
 */
class TextFilterGroup extends FilterGroup{

	@findByClass("rowButton")
	private showMoreButton: Button;

	@findByClass("rowButton")
	private showLessButton: Button;

	constructor(protected element: WebElement){
		super(element);
	}

	/**
	 * Get all text filter options in this text filter group.
	 * @returns All available text filter options in a group
	 */
	public async getTextFilterOptions(){
		const options = await this.filterOptionsContainer.findElements({xpath:".//a"});
		if(options){
			const optionComponents = options.map((option) => {
				return new TextFilterOption(option);
			});
			return optionComponents;	
		}
		else{
			throw new FilterOptionError("Filter option not available for this filter group");
		}	
	}

	/**
	 * Click the show all options button so that additional 
	 * filter options in a filter group are shown. 
	 */
	public async showAllOptions(){
		return this.showMoreButton.click();
	}

	/**
	 * Determine if there are additional filter options 
	 * hidden behind a button
	 * @returns If there are hidden options, true. Otherwise, false.
	 */
	public async moreOptionsAreAvailable(){
		const moreOptionsButton = await this.element.findElements({className:"rowButton"});
		const exists =  moreOptionsButton.length !== 0 ? true : false;
		return exists;
	}

	/**
	 * Select a filter option. 
	 * @param filterOption The filter option to select
	 */
	public async selectTextFilterOption(filterOption: string){
		if(!await this.isExpanded()){
			await this.expandFilterGroup();
		}

		if(await this.moreOptionsAreAvailable()){
			await this.showAllOptions();
		}

		const options = await this.getTextFilterOptions();
		for(const option of options){
			const opText = await option.text();
			if(filterOption.toLowerCase() == opText.toLowerCase()){
				await option.select();
				return option;
			}
		}
	}

	/**
	 * Remove a filter option that is selected. 
	 * @param filterOption The filter option to deselect
	 * @returns 
	 */
	public async deselectFilterOption(filterOption: string){
		if(!await this.isExpanded()){
			await this.expandFilterGroup();
		}

		if(await this.element.findElements({className:"rowButton"})){
			await this.showAllOptions();
		}

		const options = await this.getTextFilterOptions();
		for(const option of options){
			const opText = await option.text();
			if(filterOption == opText){
				await option.deselect();
				return option;
			}
		}
	}
}

/**
 * A text filter group has multiple text filter options. 
 */
class TextFilterOption{

	@findByCSS("input[type='checkbox']")
	private checkbox: Checkbox;

	protected browser; //Required to make the findBy function correctly.
	constructor(protected element: WebElement){
		this.browser = element;
	}

	/**
	 * Get the filter text of the filter option. 
	 */
	public text(){
		return this.element.getText();
	}

	/**
	 * Select a filter option
	 */
	public async select(){
		if(!await this.checkbox.isChecked())
		{
			return this.element.click();
		}
	}

	/**
	 * Deselect a filter option
	 */
	public async deselect(){
		if(await this.checkbox.isChecked())
		{
			return this.element.click();
		}
	}
}

/**
 * For appling a customer review filter option on 
 * ther product search page.
 */
class CustomerReviewFilterGroup extends FilterGroup{

	constructor(protected element: WebElement){
		super(element);
	}

	/**
	 * Apply a customer review filter option to the product search page.
	 * @param reviewStars How many stars to filter on. 
	 */
	public async selectReview(reviewStars: CustomerReviewFilterOptions){
		if(!(await this.isExpanded())){
			this.expandFilterGroup();
		}
		const filter = await this.element.findElement({css:`a[label='${reviewStars}']`});
		await filter.click();
	}
}

/**
 * For changing the price range filter option on the 
 * product search page.
 */
class PriceFilterGroup extends FilterGroup{

	@findByClass("price-min")
	private minimumPrice: WebComponent;

	@findByClass("price-max")
	private maxPrice: WebComponent;

	@findByClass("noUi-hand-handle-upper")
	private upperPriceHandle: WebComponent;

	@findByClass("noUi-hand-handle-lower")
	private lowerPriceHandle: WebComponent;

	constructor(protected element: WebElement){
		super(element);
	}

	public async setLowerPrice(newLowerPrice: number){
		throw new Error("Method not implemented.");
	}

	public async setUpperPrice(newUpperPrice: number){
		throw new Error("Method not implemented.");
	}
}

/**
 * For use in applying a customer review filter on
 * the produts search page.
 */
enum CustomerReviewFilterOptions {
	ThreeStars = "3 Stars and Up",
	FourStars = "4 Stars and Up",
	FiveStars = "5 Stars and Up"
}
