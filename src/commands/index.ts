import { Command } from "../@types/Command";
import { play } from "./play";
import { stop } from "./stop";
import { add } from "./add";

export const CommandList: Command[] = [play, stop, add];
