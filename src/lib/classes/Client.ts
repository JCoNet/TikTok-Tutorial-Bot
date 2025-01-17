import {
	Client as DiscordClient,
	ClientEvents,
	Collection,
	GatewayIntentBits as Intent,
} from "discord.js";
import { TCommand } from "../types/Command";
import { glob } from "glob";
import { ClientEvent } from "./Event";

export class Client extends DiscordClient {
	commands: Collection<string, TCommand> = new Collection();

	constructor() {
		super({
			intents: [
				Intent.Guilds,
				Intent.GuildMessages,
				Intent.GuildMembers,
				Intent.GuildPresences,
				Intent.GuildModeration,
				Intent.DirectMessages,
				Intent.MessageContent,
			],
		});
	}

	start() {
		this.registerModules();
		this.login(process.env.DISCORD_TOKEN);
	}

	async importFile(filePath: string) {
		return (await import(filePath))?.default;
	}

	async registerModules() {
		// Commands registration
		const commandFiles = await glob("../../commands/**/*.{ts,js}", {
			cwd: __dirname,
		});

		console.log(`Registering ${commandFiles.length} commands...`);

		commandFiles.forEach(async (filePath) => {
			const command: TCommand = await this.importFile(filePath);

			if (!command.data || !command.execute || !command.data.name) return;

			console.log("Registered command:", command.data.name);

			this.commands.set(command.data.name, command);
		});

		// Events registration
		const eventFiles = await glob("../../events/*.{ts,js}", {
			cwd: __dirname,
		});

		console.log(`Registering ${eventFiles.length} events...`);

		eventFiles.forEach(async (filePath) => {
			const event: ClientEvent<keyof ClientEvents> =
				await this.importFile(filePath);

			if (event.once) {
				console.log("Registered once event:", event.name);

				this.once(event.name, async (...args) => {
					event.execute(...args);
				});
			} else {
				console.log("Registered on event:", event.name);

				this.on(event.name, async (...args) => {
					event.execute(...args);
				});
			}
		});
	}
}
