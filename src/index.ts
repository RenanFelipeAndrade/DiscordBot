import { Client, IntentsBitField } from "discord.js";
import { config } from "dotenv";
import { onReady } from "./events/onReady";
import { onInteraction } from "./interactions";

(async () => {
  config();
  const intents = new IntentsBitField(["Guilds", "GuildVoiceStates"]);
  const bot = new Client({ intents: intents });

  await bot.login(process.env.BOT_TOKEN);
  bot.on("ready", () => onReady(bot));
  bot.on(
    "interactionCreate",
    async (interection) => await onInteraction(interection, bot)
  );
})();
