import "reflect-metadata";
import { ByHash } from "selenium-webdriver";

/**
 * When this code is used inside a property decorator what is happening is a class property 
 * is created. The property will be of whatever type is given via typescript.
 * 
 * So when used like 
 * findById("myId")
 * private myPageComponent: Button
 * 
 * A property is attached to the POM class where the name is 
 * myPageComponent, it is of type Button, and then a get function is 
 * created that returns a NEW Button component when called.
 * 
 * This promise part is important. It means that when a Page Object Model (POM) is created, 
 * that the components of those pages are defined, but those componentes are not searched for 
 * UNTIL the property is used. So everytime a POM property is used like myPageComponent.click(), the component on the page 
 * is searched for, again.
 * 
 * @param target The class being effected. 
 * @param propertyKey The name of the property to change
 * @param selector A find by selector for the component
 */
function componentFactory(target: any, propertyKey: string, selector: ByHash){
	const selectorString = `By: ${Object.keys(selector)[0]}, On: ${Object.values(selector)[0]}`;
	const type = Reflect.getMetadata("design:type", target, propertyKey);
	Object.defineProperty(target, propertyKey, {
		configurable: true,
		enumerable: true,
		get: function() {
			const promise = this.browser.findElement(selector);
			return new type(promise, selectorString);
		},
	});
}

/**
 * Use as a decorator on a WebComponent property of a POM
 * Find a component by their css ID
 * @param idSelector The ID 
 * @returns Nothing. 
 */
export function findById(idSelector: string){
	return (target: any, propertyKey: string) => {
		componentFactory(target, propertyKey, {id:`${idSelector}`});
	};
}

/**
 * Use as a decorator on a WebComponent property of a POM
 * Find a component by their css class 
 * @param selector The css class name selector
 * @returns Nothing. 
 */
export function findByClass(selector: string){
	return (target: any, propertyKey: string) => {
		componentFactory(target, propertyKey, {className:`${selector}`});
	};
}

/**
 * Use as a decorator on a WebComponenet propery of a POM
 * Find all components by their css class.
 * @param selector The selector used to find all available webComponents
 * @returns Nothing.
 */
export function findAllByClass(selector: string){
	return (target: any, propertyKey: string) => {
		const type = Reflect.getMetadata("design:type", target, propertyKey);
		Object.defineProperty(target, propertyKey, {
			configurable: true,
			enumerable: true,
			get: function() {
				const promise = this.browser.findElements({className:`${selector}`});
				return new type(promise, selector);
			},
		});
	};
}

/**
 * Use as a decorator on a WebComponent property of a POM
 * Find an component by their _visible_ link text, used on <a> tags. 
 * @param linkText The links tags text
 * @returns Nothing. 
 */
export function findByLinkText(linkText: string){
	return (target: any, propertyKey: string) => {
		componentFactory(target, propertyKey, {linkText:`${linkText}`});
	};
}

/**
 * Use as a decorator on a WebComponent property of a POM
 * Find an component by the class name of the component.
 * @param nameValue The css class name of the component
 * @returns Nothing. 
 */
export function findByName(nameValue: string){
	return (target: any, propertyKey: string) => {
		componentFactory(target, propertyKey, {name:`${nameValue}`});
	};
}

/**
 * Use as a decorator on a WebComponent property of a POM
 * Find an component by their _visible_ link text, used on <a> tags. 
 * @param linkText The links tags text
 * @returns Nothing. 
 */
export function findByPartialLinkText(linkText: string){
	return (target: any, propertyKey: string) => {
		componentFactory(target, propertyKey, {partialLinkText:`${linkText}`});
	};
}

/**
 * Use as a decorator on a WebComponent property of a POM
 * Find an component by the css of the component. Useful for finding 
 * html tags as well - e.g. <div>
 * @param cssIdentifier The css identifier
 * @returns 
 */
export function findByCSS(cssIdentifier: string){
	return (target: any, propertyKey: string) => {
		componentFactory(target, propertyKey, {css:`${cssIdentifier}`});
	};
}

/**
 * Use as a decorator on a WebComponent property of a POM
 * Find an component by an xpath.
 * @param xpath The xpath to find the component
 * @returns Nothing. 
 */
export function findByXpath(xpath: string){
	return (target: any, propertyKey: string) => {
		componentFactory(target, propertyKey, {xpath:`${xpath}`});
	};
}