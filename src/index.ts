import { Client } from "discord.js";
import { config } from "dotenv";
import { onReady } from "./events/onReady";
import { onInteraction } from "./interactions";

(async () => {
  config();
  const bot = new Client({ intents: 8 });

  await bot.login(process.env.BOT_TOKEN);
  bot.on("ready", () => onReady(bot));
  bot.on("interactionCreate", onInteraction);
})();
