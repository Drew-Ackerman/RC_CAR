import { Browser } from ".";
import { accessSync, constants, mkdirSync } from "fs";
import path = require("path");
const addContext = require('mochawesome/addContext');

export async function snapshot(testContext:Mocha.Context, browser: Browser){
    //Record the screen and place that data somewhere          
    let friendlyTestName = testContext.currentTest?.title.split(' ').join('_'); //Replace spaces with underscores

    let testFilePath = testContext.test?.file || ""; //The full file path of the currently running test
    let testDirectory = path.dirname(testFilePath);
    let mochawesomeDir = path.join(testDirectory, '../../mochawesome-report/assets/screenshots');

    //Create the directory, if it exists then thats okay
    try{
        accessSync(mochawesomeDir, constants.R_OK | constants.W_OK);
    }catch(err){
        //Dir doesnt exist
        try{
            mkdirSync(mochawesomeDir, {recursive:true});
        } catch(err){
            console.log("Error making directory for", err)
        }
    }

    let screenshotPath = path.join(mochawesomeDir, `${friendlyTestName}.png`)
    addContext(testContext, {
        title: `Test ${friendlyTestName} failed:`,
        value: `./assets/screenshots/${friendlyTestName}.png`
    });
    await browser.takeScreenshot(screenshotPath);
}