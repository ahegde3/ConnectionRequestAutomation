import * as dotenv from "dotenv";
dotenv.config();
import {
  linkedInBotInitializer,
  sendReachoutMessage,
} from "./services/linkedInBot";



async function main(): Promise<void> {
  await linkedInBotInitializer();
  await sendReachoutMessage();

}

main();

