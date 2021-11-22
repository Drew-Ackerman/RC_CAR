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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSearchPage = void 0;
const lib_1 = require("../lib");
class ProductSearchPage extends lib_1.Page {
    constructor(browser) {
        super(browser);
    }
    findAllProductsOnPage() {
        this.PageProducts.getDisplayed();
    }
    loadCondition() {
        return (0, lib_1.elementIsVisible)(() => this.MainPageTitle);
    }
}
__decorate([
    (0, lib_1.findByClass)('mainPageTitle'),
    __metadata("design:type", lib_1.WebComponent)
], ProductSearchPage.prototype, "MainPageTitle", void 0);
__decorate([
    (0, lib_1.findAllByClass)('product'),
    __metadata("design:type", lib_1.WebComponents)
], ProductSearchPage.prototype, "PageProducts", void 0);
exports.ProductSearchPage = ProductSearchPage;
