import {
	SlashCommandBuilder,
	ApplicationIntegrationType as Integrations,
	InteractionContextType as Contexts,
	EmbedBuilder,
	Colors,
} from "discord.js";
import { Command } from "../../lib/classes/Command";

const builder = new SlashCommandBuilder()
	.setName("ping")
	.setDescription("Replies with pong and api latency")
	.setIntegrationTypes(Integrations.GuildInstall, Integrations.UserInstall)
	.setContexts(Contexts.Guild, Contexts.BotDM, Contexts.PrivateChannel);

export default new Command({
	data: {
		...builder.toJSON(),
	},
	async execute(interaction) {
		const commandInitiated = interaction.createdTimestamp;
		const commandStart = Date.now();
		const apiLatency = commandStart - commandInitiated;

		const embed = new EmbedBuilder()
			.setTitle("Bot API Latency info")
			.setDescription(
				"How fast the bot is recieving and responding to commands"
			)
			.addFields([
				{ name: "Discord API", value: `${apiLatency}ms`, inline: true },
			]);

		if (apiLatency >= 0 && apiLatency < 200) {
			embed.setColor(Colors.Green);
		} else if (apiLatency >= 200 && apiLatency < 500) {
			embed.setColor(Colors.Orange);
		} else {
			embed.setColor(Colors.Red);
		}

		return interaction.reply({
			content: "Pong!",
			embeds: [embed],
		});
	},
});
