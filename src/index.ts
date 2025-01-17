import { Client } from "./lib/classes/Client";

require("dotenv").config();

export const bot = new Client();

bot.start();
