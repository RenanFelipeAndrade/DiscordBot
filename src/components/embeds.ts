import { EmbedBuilder } from "@discordjs/builders";

export { defaultEmbed, errorEmbed, successEmbed, primaryEmbed };

const errorEmbed = (message: string, title?: string) => {
  const errorEmbed = new EmbedBuilder()
    .setColor(0xed4245)
    .setDescription(message);
  if (title) errorEmbed.setTitle(title);
  return errorEmbed;
};

const defaultEmbed = (message: string, title?: string) => {
  const defaultEmbed = new EmbedBuilder()
    .setDescription(message)
    .setColor(0x4f545c);
  if (title) defaultEmbed.setTitle(title);
  return defaultEmbed;
};
const successEmbed = (message: string, title?: string) => {
  const successEmbed = new EmbedBuilder()
    .setColor(0x3ba55c)
    .setDescription(message);
  if (title) successEmbed.setTitle(title);
  return successEmbed;
};

const primaryEmbed = (message: string, title?: string) => {
  const primaryEmbed = new EmbedBuilder()
    .setDescription(message)
    .setColor(0x5865f2);
  if (title) primaryEmbed.setTitle(title);
  return primaryEmbed;
};
