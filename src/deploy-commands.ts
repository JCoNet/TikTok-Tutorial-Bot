require("dotenv").config();

import { REST, Routes } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";

async function main() {
	const commands = [];

	const foldersPath = join(__dirname, "commands");
	const commandFolders = readdirSync(foldersPath);

	for (const folder of commandFolders) {
		const commandsPath = join(foldersPath, folder);
		const commandFiles = readdirSync(commandsPath).filter((file) =>
			file.endsWith(".ts")
		);

		for (const file of commandFiles) {
			const filePath = join(commandsPath, file);
			const command = (await import(filePath))?.default;

			if (
				!command ||
				!command.data ||
				!command.execute ||
				!command.data.name
			) {
				return console.error(
					filePath,
					"has some missing required information."
				);
			}

			commands.push(command.data);
		}
	}

	const rest = new REST({ version: "10" }).setToken(
		process.env.DISCORD_TOKEN
	);

	(async () => {
		if (process.env.ENVIRONMENT === "prod") {
			try {
				console.log(
					`Started reloading ${commands.length} appliation slash commands...`
				);

				const data: any = await rest.put(
					Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
					{
						body: commands,
					}
				);

				console.log(
					`Successfully reloaded ${data.length} application slash commands.`
				);
			} catch (error) {
				console.error(error);
			}
		} else {
			try {
				console.log(
					`[DEV] Started reloading ${commands.length} application guild slash commands...`
				);

				const data: any = await rest.put(
					Routes.applicationGuildCommands(
						process.env.DISCORD_CLIENT_ID,
						process.env.DISCORD_DEV_GUILD_ID
					),
					{
						body: commands,
					}
				);

				console.log(
					`[DEV] Successfully reloaded ${data.length} application guild slash commands.`
				);
			} catch (error) {
				console.error(error);
			}
		}
	})();
}

main();
