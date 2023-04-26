import { Command } from "../@types/Command";
import { play } from "./play";
import { stop } from "./stop";
import { add } from "./add";
import { pause } from "./pause";
import { resume } from "./resume";
import { skip } from "./skip";

export const CommandList: Command[] = [play, stop, add, pause, resume, skip];
