"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = exports.sendReachoutMessage = exports.linkedInBotInitializer = void 0;
const test_1 = require("@playwright/test");
// import * as dotenv from "dotenv";
const template_1 = require("../constants/template");
const utility_1 = require("../utility");
console.log(process.env);
const USER_NAME = (_a = process.env.USER_NAME) !== null && _a !== void 0 ? _a : "";
const PASSWORD = (_b = process.env.PASSWORD) !== null && _b !== void 0 ? _b : "";
let browser = null;
const linkedInBotInitializer = () => __awaiter(void 0, void 0, void 0, function* () {
    browser = yield test_1.chromium.launch({ headless: false });
});
exports.linkedInBotInitializer = linkedInBotInitializer;
const sendReachoutMessage = () => __awaiter(void 0, void 0, void 0, function* () {
    if (browser === null)
        throw new Error("Browser not initialized");
    const page = yield browser.newPage();
    yield page.goto("https://www.linkedin.com");
    console.log("browser open");
    yield (0, exports.Login)(page);
    // const personList= ["Esha Chiplunkar","aishwarya honap"]
    const personObjectList = [
        { name: "Anish Hegde", companyName: "ABC Corp" },
    ];
    for (const personObject of personObjectList) {
        console.log(personObject);
        yield searchPerson(page, personObject);
    }
    // await searchPerson(page)
    // await searchJobs(page,"Software Developer");
    //await getJobsFromLinkedinPage(page).catch(e=>console.log(e))
    console.log("done");
    yield browser.close();
});
exports.sendReachoutMessage = sendReachoutMessage;
const Login = (page) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(USER_NAME, PASSWORD);
    yield page.fill("id=session_key", USER_NAME);
    yield page.fill("id=session_password", PASSWORD);
    yield page.click('button:has-text("Sign in")');
});
exports.Login = Login;
const searchPerson = (page, personObject) => __awaiter(void 0, void 0, void 0, function* () {
    const message = (0, template_1.createReachoutMessage)(personObject.name, personObject.companyName);
    console.log(message);
    yield (0, utility_1.sleep)(2000);
    yield page.fill('input[placeholder="Search"]', personObject.name);
    yield page.keyboard.press("Enter");
    yield page.waitForTimeout(2000);
    yield page.click('button:has-text("Connect")');
    yield page.waitForTimeout(2000);
    yield page.click('button:has-text("Add a note")');
    yield page.fill('textarea[name="message"]', message);
});
