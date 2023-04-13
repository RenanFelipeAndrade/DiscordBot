import { Client, IntentsBitField } from "discord.js";
import { config } from "dotenv";

config();
const intents = new IntentsBitField(["Guilds", "GuildVoiceStates"]);
export const bot = new Client({ intents: intents });
