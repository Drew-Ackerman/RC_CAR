import { IBrowser } from "../interfaces/IBrowser";
import { findByClass, findByCSS, Table, WebComponent } from "../lib";

const months = ["january", "february", "march", "april", "may", "june", "july", 
	"august", "september", "october", "november", "december"];

/**
 * The datepicker is the calendar seen in the In Store Pickup option of the checkout page process
 */
export class DatePicker {

	@findByCSS("div[id='ui-datepicker-div']")
	private datepickerContainer: WebComponent;

	@findByClass("ui-datepicker-header")
	private datepickerHeader: WebComponent;

	@findByClass("ui-datepicker-prev")
	private datepickerPreviousButton: WebComponent;

	@findByClass("ui-datepicker-next")
	private datepickerNextButton: WebComponent;

	@findByClass("ui-datepicker-title")
	private datepickerTitle: WebComponent;

	@findByCSS("table[class='ui-datepicker-calendar']")
	private calendarBody: Table;


	constructor(protected browser: IBrowser){	}

	/**
	 * @returns The currently displayed year
	 */
	private async getCurrentlySelectedYear(){
		const title = await this.datepickerTitle.getText();
		const splits = title.split(" ");
		const year = splits.pop();
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
			const isValid = await (await day.getAttribute("class")).includes("ui-datepicker-today");
			if(isValid){
				const text = await day.getText();
				const date = Number(text);
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
	 * Selected a date after today
	 * @param daysAfterToday How many days after today?
	 */
	public async selectADateAfterToday(daysAfterToday:number){
		const currentlySelectedDate = await this.getCurrentlySelectedCalendarDate();
		const futureDate = new Date();
		futureDate.setDate(futureDate.getDate() + daysAfterToday);

		//If the future date is NOT within the same month 
		//Then increment the month
		if(futureDate.getMonth() != currentlySelectedDate.getMonth()){
			await this.selectNextMonth();
		}

		//Now go and select the day
		const futureDay = futureDate.getDate();
		const availableDays = await this.getAvailableDaysInThisMonth();
		for(const avilableDay of availableDays){
			const day = Number(await avilableDay.getText());
			if(day == futureDay){
				await avilableDay.click();
				return;
			}
		}
		throw new Error(`Was unable to select date ${futureDate.toString()} when attempting to select ${daysAfterToday} days after ${currentlySelectedDate}`);
	}

	/**
	 * Select the next available date on the datepicker. 
	 */
	public async selectNextAvailableDate(){
		//First check for availability this month
		let availableDates = await this.getAvailableDaysInThisMonth();
		if(availableDates.length == 0){
			//Check the next month
			await this.selectNextMonth();
			availableDates = await this.getAvailableDaysInThisMonth();
			if(availableDates.length == 0){
				throw new Error("No available dates available in the calendar");
			}
		}
		//Now with available dates
		const firstAvailableDate = availableDates[0];
		await firstAvailableDate.click();	
	}
}