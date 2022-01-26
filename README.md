# What is RC_CAR?
RC_CAR is a UI testing suite. Selenium is utilized as the web automation driver. 
Mocha is used to describe, create, and run tests. Together they are both used 
to create a UI testing suite. 

An important part of the framework is that Selenium is abstracted away so that 
tests can be written in short understandable chunks. You can see this abstraction at 
work in the 'lib' folder. Additionaly the Page Object Model is utilized to reduce 
code duplication and allow tests to change easily when breaking changes are made 
to the main product. 

## What is the Page Object Model (POM)?
Essentially POM takes every page on a website and turns it into its own class. 
This class would have properties that are web elements, and methods that are
functionalities of that page. For example, a Login POM would have username and password 
input properites, a submit button property, and a Login method. The login method would 
type in fields and submit. 

## Why Javascript and why Typescript?
Selenium implements javascript in a nice way, its also a part of the existing tech stack
used in the website. Typescript gives Javascript some nice to haves (type system, type checks, sane importing) 
which allow developers and easier time working with javascript.

Javascript also allows NPM, and NVM which are helpful in creating cross platform tools that are 
extremely simple to setup and distribute on any system. 

## Visual Studio Code
Visual Studio Code is not neccesary to run this project, but I highly recommend it. Theres a debug configuration 
setup for Mocha for VSCode under the .vscode folder. 

## What is Mocha?
Mocha is a testing framework for JavaScript. Its easy to use and allows expressive testing to be done with minimal effort.

## What do I need to do at minimum to run the tests?
1. Have Node js installed. 
2. Install the node modules for the project, `npm install` 
3. Install the browsers you want to test. 

## What browsers can I run tests on?
Any browser that you have the driver for, and that is installed on the machine running the tests

### Browser Drivers
Each browser has its own driver that selenium uses. Chrome -> Chromdriver, Firefox -> geckodriver. There are also
drivers for: 
1. Internet Explorer
2. Opera
3. Safari
4. Edge

### How many browsers should I test against?
Unless a specific edge case arrises in a browser that needs to be supported, like IE,
its best to run tests on a minimum of browsers. There is a large difference in run time when 
testing against 1 browser instead of 6. What makes tests most useful is when they provide quick feedback to developers.

That is why this project comes with only 2 driver by default, Chrome and Firefox. 

## Testing 

### What makes a good test.
Attributes of a good test listed in order of importance:
1. Provides value, 
2. Is Reliable
3. Is Fast

Because UI tests take longer than most and are prone to fragility, it is important that every test is meaningful. For instance you could write two tests, one to test if users can log in, and one to test if users can access account information. In this example only one test is actually needed to cover both functionalities, can users access account information, because to access account information it is necessary to login. Ensure that you note that testing behaviour down so that it is know the test is covering two or more functionalities instead of just one. 

*Be careful*, it can be easy to slip into creating large tests that test multiple seperate features. Do not do that. 

Reliable tests should be not return differnt results between executions. If a test fails half the time, then its either poorly written or its going about the testing in an unreliable way. 

Slow tests are test unrun. Some tests *have* to be slow, most dont. If you have several slow tests, figure out why they are slow and if there is any way to speed them up while also keeping them _reliable_ and _meaningful_. If that means the tests are still slow, then consider how often the slow tests need to be ran. *Key note* - slow is relative, if a testing a purchase takes 2 minutes, thats okay. If a login takes 2 minutes, thats a problem. 

Its important to realize that creating these high level tests is an opprotunity to see what its like to use the product from the prospective of a user. If something feels difficult, ask yourself, "Why is this feature like this? Why do I have to do 3 steps when 2 would work?". This gives insight into improvments that are not seen when developing to fit a specific feature set. 

### Test often
Make testing a part of the development process. Ensure tests are done by the developer themselves before they release code for review. It is easier and less expensive to fix a bug before review and definitely before the code is in production. 

### Setup
The following things are needed before the program can be run
1. Have node.js installed and updated.
2. Have npm installed and updated.
3. Run the following commands:
`npm install` - this will need to be run any time there are changes to the package.json
4. Then to run tests: 
`npm run test` - It will automatically run against test, if you want it to run against your local then change the baseUrl in config.ts
## Project layout

### src
Holds all the supporting framework code. 

#### exceptions
Holds custom exceptions that extend Error. Making a custom exception system is useful, but `throw new Error("Message")` works just fine to. Especially since a majority of Errors should be used to hault a test and provide useful information in debugging. Example, throwing an error when a specific item is not found in a collection of items.

#### interfaces
Interfaces are used here to prevent circular dependency issues in the code. If one wants to check for circular dependencies for the project, run `npm run init-depcruiser`, followed by `npm run check-dependencies`. Both of the scripts being run are defined in package.json.

#### lib
This is a collection of files that make up the backbone of this framework. Each file within lib contains a header that should provide additional information. 

#### pages
Contains a list of POMs. Essentially a page on the website is represented by a Page Object Model. 

##### Adding pages
1. Define your page. This is where you make a class, extend the class from Page, and start defining Components and Actions on that page. 
2. Add this new page to the AllPages class; add it to the class' properties and then instatiate it in the class' constructor.

#### partials
Contains content that is reused throughout multiple pages, like the header bar, or things that are complex and large, like the datepicker.

#### popups
Similar design concept to POMs, but as a popup. 

##### Adding popups
1. Define the popup. 
2. Add the popup to the AllPopups class. 

#### types
Defining complex types that are reused throughout the project? Go here. If the type is only relevant to a single page, place the type in that pages file. 