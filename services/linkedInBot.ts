import { chromium, Browser, Page } from "@playwright/test";

import { createReachoutMessage } from "../constants/template";
import { sleep } from "../utility";



interface PersonObject {
  name: string;
  companyName: string;
}


const USER_NAME: string = process.env.USER_NAME ?? "";
const PASSWORD: string = process.env.PASSWORD ?? "";

let browser: Browser | null = null;

export const linkedInBotInitializer = async () => {
  browser = await chromium.launch({ headless: false });
};

export const sendReachoutMessage = async () => {
  if (browser === null) throw new Error("Browser not initialized");

  const page = await browser.newPage();
  await page.goto("https://www.linkedin.com");
  await Login(page);

  // const personList= ["Esha Chiplunkar","aishwarya honap"]
  const personObjectList: PersonObject[] = [
    { name: "Anish Hegde", companyName: "ABC Corp" },
  ];
  for (const personObject of personObjectList) {
    console.log(personObject);
    await searchPerson(page, personObject);
  }

  console.log("done");
  await browser.close();
};

export const Login = async (page: Page) => {
  console.log(USER_NAME, PASSWORD);
  await page.fill("id=session_key", USER_NAME);
  await page.fill("id=session_password", PASSWORD);
  await page.click('button:has-text("Sign in")');
};

const searchPerson = async (
  page: Page,
  personObject: PersonObject
): Promise<void> => {
  const message: string = createReachoutMessage(
    personObject.name,
    personObject.companyName
  );

  console.log(message);

  await sleep(2000);

  await page.fill('input[placeholder="Search"]', personObject.name);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(2000);
  await page.click('button:has-text("Connect")');
  await page.waitForTimeout(2000);
  await page.click('button:has-text("Add a note")');

  await page.fill('textarea[name="message"]', message);
};
