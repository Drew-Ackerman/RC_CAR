import { WebElementPromise } from "selenium-webdriver";
import { findByClass, findById, Table, WebComponent } from "../lib";

const months = ["january", "february", "march", "april", "may", "june", "july", 
	"august", "september", "october", "november", "december"];

/**
 * The datepicker is the calendar seen in the In Store Pickup option of the checkout page process
 */
export class DatePicker extends WebComponent {

	@findById("ui-datepicker-div")
	private datepickerContainer: WebComponent;

	@findByClass("ui-datepicker-header")
	private datepickerHeader: WebComponent;

	@findByClass("ui-datepicker-prev")
	private datepickerPreviousButton: WebComponent;

	@findByClass("ui-datepicker-next")
	private datepickerNextButton: WebComponent;

	@findByClass("ui-datepicker-title")
	private datepickerTitle: WebComponent;

	@findByClass("ui-datepicker-calendar")
	private calendarBody: Table;


	private browser;
	constructor(element: WebElementPromise, selector: string){
		super(element,selector);
		this.browser = element;
	}

	/**
	 * @returns The currently displayed year
	 */
	private async getCurrentlySelectedYear(){
		const title = await this.datepickerTitle.getText();
		const year = title.split(" ").at(-1);
		return Number(year);
	}

	/**
	 * @returns The currently displayed month in integer form, with january starting at 0 
	 */
	private async getCurrentlySelectedMonth(){
		const title = await this.datepickerTitle.getText();
		try{
			const monthText = title.split(" ")[0].toLowerCase();
			const monthNumber = months.indexOf(monthText);
			return Number(monthNumber);
		}catch(error){
			throw Error(`Couldnt grab the datepicker's month because of error: ${error}`);
		}
	}

	/**
	 * @returns A collection of all days displayed on the calendar
	 */
	private async getAllDaysInThisMonth(){
		const daysInMonth = [];
		const days = await this.calendarBody.tableCells();
		for(const day of days){
			if(!(await day.getAttribute("class")).includes("ui-datepicker-other-month")){
				daysInMonth.push(day);			
			}
		}
		return daysInMonth;
	}

	/**
	 * @returns A collection of all displayed days that are selectable on the calendar
	 */
	private async getAvailableDaysInThisMonth(){
		const availableDays = [];
		const allDaysInMonth = await this.getAllDaysInThisMonth();
		for(const day of allDaysInMonth){
			if(!(await day.getAttribute("class")).includes("ui-datepicker-unselectable")){
				availableDays.push(day);
			}
		}
		return availableDays;
	}

	/**
	 * @returns The current day of the calendar
	 */
	private async getCurrentDay(){
		const days = await this.calendarBody.tableCells();
		for(const day of days){
			if((await day.getAttribute("class")).includes("ui-datepicker-today")){
				const date = Number(day.getText());
				return date;
			}
		}
	}

	/**
	 * Extract the current Year,Month,Day date from the calendar
	 * @returns A date object
	 */
	private async getCurrentlySelectedCalendarDate(){
		const day = await this.getCurrentDay();
		const month = await this.getCurrentlySelectedMonth();
		const year = await this.getCurrentlySelectedYear();

		const currentlySelectedDate = new Date(year,month,day);
		return currentlySelectedDate;
	}

	/**
	 * Click on the button that takes the calendar to the previous month
	 */
	private async selectPreviousMonth(){
		return this.datepickerPreviousButton.click();
	}

	/**
	 * Click on the button that takes the calendar to the next month
	 */
	private async selectNextMonth(){
		return this.datepickerNextButton.click();
	}

	/**
	 * 
	 * @param daysAfterToday 
	 */
	public async selectADateAfterToday(daysAfterToday:number){
		const currentlySelectedDate = await this.getCurrentlySelectedCalendarDate();
		const futureDate = new Date(currentlySelectedDate.getDate());
		futureDate.setDate(futureDate.getDate()+daysAfterToday);

		//If the future date is NOT within the same month 
		//Then increment the month
		if(futureDate.getMonth() != currentlySelectedDate.getMonth()){
			await this.selectNextMonth();
		}

		//Now go and select the day
		const availableDays = await this.getAvailableDaysInThisMonth();
		for(const avilableDay of availableDays){
			const day = Number(await avilableDay.getText());
			if(day == futureDate.getDay()){
				await avilableDay.click();
			}
		}
		throw new Error(`Was unable to select date ${futureDate.toString()} when attempting to select ${daysAfterToday} days after ${currentlySelectedDate}`);
	}
}