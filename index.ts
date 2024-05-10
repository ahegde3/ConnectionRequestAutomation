// global-setup.ts
// import endpoint from './config';

// import { Puppeteer } from "puppeteer";

import { chromium, Page } from "@playwright/test";
import * as dotenv from "dotenv";
import { createReachoutMessage } from "./constants/template";
// const chromium = require('playwright').chromium;

dotenv.config();

const USER_NAME: string = process.env.USER_NAME ?? "";
const PASSWORD: string = process.env.PASSWORD ?? "";

interface PersonObject {
  name: string;
  companyName: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const Login = async (page: Page) => {
  await page.fill("id=session_key", USER_NAME);
  await page.fill("id=session_password", PASSWORD);
  await page.click('button:has-text("Sign in")');
};

async function main(): Promise<void> {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.linkedin.com");
  console.log("browser open");
  await Login(page);

  // const personList= ["Esha Chiplunkar","aishwarya honap"]
  const personObjectList: PersonObject[] = [
    { name: "Anish Hegde", companyName: "ABC Corp" },
  ];
  for (const personObject of personObjectList) {
    console.log(personObject);
    await searchPerson(page, personObject);
  }

  // await searchPerson(page)
  // await searchJobs(page,"Software Developer");
  //await getJobsFromLinkedinPage(page).catch(e=>console.log(e))
  console.log("done");

  //   await page.context().storageState({ path: 'state.json' });
  //   await browser.close();
}

async function searchPerson(
  page: Page,
  personObject: PersonObject
): Promise<void> {
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
}

main();
// export default main;
