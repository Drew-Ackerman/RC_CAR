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
exports.AccountCreationPage = void 0;
const lib_1 = require("../lib");
class AccountCreationPage extends lib_1.Page {
    constructor(browser) {
        super(browser);
    }
    createDemoUsername() {
    }
    FillInNewAccountForm(email, password, answer) {
        this.EmailAddressInput.type(email);
        this.NewPasswordInput.type(password);
        this.NewPassword2Input.type(password);
        this.AnswerInput.type(answer);
        this.Answer2Input.type(answer);
        this.SubmitButton.click();
    }
    loadCondition() {
        return (0, lib_1.urlContainsValue)(this.browser, 'Create-Account-Action');
    }
}
__decorate([
    (0, lib_1.findByName)('email'),
    __metadata("design:type", lib_1.TextInput)
], AccountCreationPage.prototype, "EmailAddressInput", void 0);
__decorate([
    (0, lib_1.findById)('newPassword'),
    __metadata("design:type", lib_1.TextInput)
], AccountCreationPage.prototype, "NewPasswordInput", void 0);
__decorate([
    (0, lib_1.findById)('newPassword2'),
    __metadata("design:type", lib_1.TextInput)
], AccountCreationPage.prototype, "NewPassword2Input", void 0);
__decorate([
    (0, lib_1.findByName)('answer1'),
    __metadata("design:type", lib_1.TextInput)
], AccountCreationPage.prototype, "AnswerInput", void 0);
__decorate([
    (0, lib_1.findByName)('answer2'),
    __metadata("design:type", lib_1.TextInput)
], AccountCreationPage.prototype, "Answer2Input", void 0);
__decorate([
    (0, lib_1.findByCSS)("type=['submit']"),
    __metadata("design:type", lib_1.Button)
], AccountCreationPage.prototype, "SubmitButton", void 0);
exports.AccountCreationPage = AccountCreationPage;
