export class FilterOptionError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "FilterOptionError";
	}
}