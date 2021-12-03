import "reflect-metadata";

//Effectively a promise to pause, be sure to await it. 
/**
 * A promise to pause code execution
 * @param seconds How many seconds to pause
 * @returns A promise
 */
export const delay = (seconds: number) => {
	return new Promise((callback) => setTimeout(callback, seconds * 1000));
};

/**
 * Use as a decorator on a WebComponent property of a POM
 * Find an element by their css ID
 * @param idSelector The ID 
 * @returns Nothing. 
 */
export function findById(idSelector: string){
	return (target: any, propertyKey: string) => {
		const type = Reflect.getMetadata("design:type", target, propertyKey);
		Object.defineProperty(target, propertyKey, {
			configurable: true,
			enumerable: true,
			get: function() {
				const promise = this.browser.findElement({id:`${idSelector}`});
				return new type(promise, idSelector);
			},
		});
	};
}

/**
 * Use as a decorator on a WebComponent property of a POM
 * Find an element by their css class 
 * @param selector The css class name selector
 * @returns Nothing. 
 */
export function findByClass(selector: string){
	return (target: any, propertyKey: string) => {
		const type = Reflect.getMetadata("design:type", target, propertyKey);
		Object.defineProperty(target, propertyKey, {
			configurable: true,
			enumerable: true,
			get: function() {
				const promise = this.browser.findElement({className:`${selector}`});
				return new type(promise, selector);
			},
		});
	};
}

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
 * Find an element by their _visible_ link text, used on <a> tags. 
 * @param linkText The links tags text
 * @returns Nothing. 
 */
export function findByLinkText(linkText: string){
	return (target: any, propertyKey: string) => {
		const type = Reflect.getMetadata("design:type", target, propertyKey);
		Object.defineProperty(target, propertyKey, {
			configurable: true,
			enumerable: true,
			get: function() {
				const promise = this.browser.findElement({linkText:`${linkText}`});
				return new type(promise, linkText);
			},
		});
	};
}


export function findByName(nameValue: string){
	return (target: any, propertyKey: string) => {
		const type = Reflect.getMetadata("design:type", target, propertyKey);
		Object.defineProperty(target, propertyKey, {
			configurable: true,
			enumerable: true,
			get: function() {
				const promise = this.browser.findElement({name:`${nameValue}`});
				return new type(promise, nameValue);
			},
		});
	};
}

export function findByCSS(cssIdentifier: string){
	return (target: any, propertyKey: string) => {
		const type = Reflect.getMetadata("design:type", target, propertyKey);
		Object.defineProperty(target, propertyKey, {
			configurable: true,
			enumerable: true,
			get: function() {
				const promise = this.browser.findElement({css:`${cssIdentifier}`});
				return new type(promise, cssIdentifier);
			},
		});
	};
}
