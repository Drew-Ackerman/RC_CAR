import { IBrowser } from "../interfaces/IBrowser";
import { InformationPopup } from "./InformationPopup";
import { SetHomeStorePopup } from "./SetHomeStorePopup";
import { ZipcodePopup } from "./ZipcodePopup";

export {
	InformationPopup,
	SetHomeStorePopup,
	ZipcodePopup
};

export class AllPopups {
	public informationPopup: InformationPopup;
	public setHomeStorePopup: SetHomeStorePopup;
	public zipcodePopup: ZipcodePopup;

	constructor(browser: IBrowser){
		this.informationPopup = new InformationPopup(browser);
		this.setHomeStorePopup = new SetHomeStorePopup(browser);
		this.zipcodePopup = new ZipcodePopup(browser);
	}
}