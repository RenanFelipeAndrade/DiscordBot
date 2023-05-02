# Discord BOT

A fully-featured Discord bot using [Discord.js](https://discordjs.guide/#before-you-begin).
This personal project aims to be a music bot for the Discord platform.
It uses the [Discord.js](https://discordjs.guide/#before-you-begin) library and
[discord-player](https://www.npmjs.com/package/discord-player) for development, along with TypeScript.

## [Installing](#installing)

Clone the repo

```bash
git clone https://github.com/RenanFelipeAndrade/discord-bot.git
```

Change directory

```bash
cd discord-bot
```

Install all dependencies

```bash
npm i
```

Then, run the project

```bash
npm run dev
```

> Note: this project uses .env file. Make sure to have it setted up properly to run the project

## [Commands](#commands)

Since this bot will be used in Brazilian servers, its commands' names tend to be in Brazilian Portuguese,
but some are in English (those words that are well-known):

- `play`: reproduces a track or playlist
- `adicionar`: adds a track to the current playlist
- `pausar`: pauses the current track
- `retomar`: resumes the current track
- `parar`: stops the player, clears the queue, and makes the bot disconnect
- `playlist`: shows the current queue. It excludes the current track playing (can be changed to include the current track)
- `proxima`: skips to the next track

> There are many more commands coming in the near future!

## [About](#about)

The idea behind this project is to develop a fully-featured Discord bot that reproduces songs from YouTube,
Spotify, or any other streaming platforms. Using [discord-player](https://www.npmjs.com/package/discord-player),
it is possible to pass a link as a parameter to the `play` command and it will flawlessly reproduce the requested playlist or song.

In the future, this bot will be capable of displaying lyrics, saving playlists,
retrieving information from a database, and resuming playlists from where it was stopped.
Audio effects will also be supported, along with many more features.
