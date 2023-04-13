import { onReady } from "./events/onReady";
import { bot } from "./instances/bot";
import { onInteraction } from "./interactions";

(async () => {
  await bot.login(process.env.BOT_TOKEN);
  bot.on("ready", () => onReady(bot));
  bot.on(
    "interactionCreate",
    async (interection) => await onInteraction(interection, bot)
  );
})();
