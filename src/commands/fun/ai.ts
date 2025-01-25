import {
	MessageFlags,
	SlashCommandBuilder,
	ApplicationIntegrationType as Integrations,
	InteractionContextType as Contexts,
} from "discord.js";
import { Command } from "../../lib/classes/Command";
import { getCompletion } from "../../lib/functions/ai";

const builder = new SlashCommandBuilder()
	.setName("ai")
	.setDescription("Use an array of ai tools built for you.")
	.setIntegrationTypes(Integrations.GuildInstall, Integrations.UserInstall)
	.setContexts(Contexts.BotDM, Contexts.PrivateChannel, Contexts.Guild)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("gpt")
			.setDescription(
				"Use a generative ai to return a chat response based on your prompt."
			)
			.addStringOption((option) =>
				option
					.setName("prompt")
					.setDescription("The prompt to use with the ai.")
					.setRequired(true)
					.setMinLength(10)
					.setMaxLength(250)
			)
	);

export default new Command({
	data: {
		...builder.toJSON(),
	},
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();

		if (subcommand === "gpt") {
			const prompt = interaction.options.getString("prompt");

			if (!prompt) {
				return interaction.reply({
					content: "You must provide a prompt to use this command.",
					flags: [MessageFlags.Ephemeral],
				});
			}

			const response = await getCompletion({
				prompt,
				username: interaction.user.username,
			});

			return interaction.reply({
				content: response,
			});
		}
	},
});
