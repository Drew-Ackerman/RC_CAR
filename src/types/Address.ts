/**
 * @describe Common information needed for addresses. 
 */
export type Address = {
	firstName: string,
	lastName: string,
	streetAddress: string,
	streetAddress2: string | undefined,
	city: string,
	state: string,
	zip: string,
}