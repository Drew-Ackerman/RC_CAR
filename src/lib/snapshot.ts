import { Browser } from ".";
import { accessSync, constants, mkdirSync } from "fs";
import path = require("path");
import addContext = require("mochawesome/addContext");

/**
 * Takes a snapshot of the screen and saves the snapshot to a file that can 
 * then be used in the report generated by mochawesome. 
 * @param testContext The current mocha test context
 * @param browser The current browser
 */
export async function snapshot(testContext:Mocha.Context, browser: Browser){
	//Record the screen and place that data somewhere          
	const friendlyTestName = testContext.currentTest?.title.split(" ").join("_"); //Replace spaces with underscores

	const testFilePath = testContext.test?.file || ""; //The full file path of the currently running test
	const testDirectory = path.dirname(testFilePath);
	const mochawesomeDir = path.join(testDirectory, "../../mochawesome-report/assets/screenshots");

	//Create the directory, if it exists then thats okay
	try{
		accessSync(mochawesomeDir, constants.R_OK | constants.W_OK);
	}catch(err){
		//Dir doesnt exist
		try{
			mkdirSync(mochawesomeDir, {recursive:true});
		} catch(err){
			console.log("Error making directory for", err);
		}
	}

	const screenshotPath = path.join(mochawesomeDir, `${friendlyTestName}.png`);

	//Add a link of the snapshot to the context of the currently running test.
	addContext(testContext, {
		title: `Test ${friendlyTestName} failed:`,
		value: `./assets/screenshots/${friendlyTestName}.png`
	});

	//Take the snapshot
	await browser.takeScreenshot(screenshotPath);
}