"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomePage = void 0;
const components_1 = require("../components");
const lib_1 = require("../lib");
const config_1 = require("../../config");
/**
 * @classdesc POM for the home page of RC Willey
 */
class HomePage extends lib_1.Page {
    constructor(browser) {
        super(browser);
        this.setUrl(`${config_1.config.baseUrl}`);
        this.header = new components_1.Header(browser);
    }
    /**
     * Click the account button
     * @returns A promise for a login page POM
     */
    GoToLoginPage() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.header.ClickAccountButton();
        });
    }
    Search(searchText) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.header.SearchForItem(searchText);
        });
    }
    /**
     * The home page is loaded when the RC logo is visible
     * @returns A conditon that evaluates when the logo is visible.
     */
    loadCondition() {
        return (0, lib_1.elementIsVisible)(() => this.RCLogo);
    }
}
__decorate([
    (0, lib_1.findById)('rcwlogo'),
    __metadata("design:type", lib_1.WebComponent)
], HomePage.prototype, "RCLogo", void 0);
exports.HomePage = HomePage;
