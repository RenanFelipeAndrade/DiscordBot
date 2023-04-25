import { Player } from "discord-player";
import { bot } from "./bot";

export const player = Player.singleton(bot);
