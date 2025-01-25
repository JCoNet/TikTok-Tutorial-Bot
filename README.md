# Tuturial Discord Bot

This bot is being made as a tutorial on TikTok live. All things covered in it are being worked on live, and being explained along the way.

## Using this repo

To use this repo, you need NodeJS 22.13.0 with PNPM installed. To do this please follow the instructions from the nodejs download page.

Once you have done that, please clone this repository into the folder you would like and run the following command in the root directory where you see package.json

```bash
pnpm install
```

To deploy the commands once this is done, please paste your environment variables into .env, using .env.example as a guide.
Then, you can run the following.

```bash
pnpm deploy-commands
```

Once that has completed, you can now start your development server for this bot by using the following.

```bash
pnpm start:dev
```

Get api keys and tokens as follows

-   Discord: [https://discord.com/developers](https://discord.com/developers)
-   Groq (ai): [https://console.groq.com](https://console.groq.com)
