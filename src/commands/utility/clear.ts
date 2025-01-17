import {
	ApplicationIntegrationType as Integrations,
	InteractionContextType as Contexts,
	SlashCommandBuilder,
	PermissionFlagsBits as Permissions,
	MessageFlags,
} from "discord.js";
import { Command } from "../../lib/classes/Command";

const builder = new SlashCommandBuilder()
	.setName("clear")
	.setDescription("Clear a number of messages from a channel automatically.")
	.setDefaultMemberPermissions(Permissions.ManageMessages)
	.addNumberOption((option) =>
		option
			.setName("amount")
			.setDescription("The amount of messages to delete.")
			.setMinValue(1)
			.setMaxValue(250)
			.setRequired(true)
	)
	.setIntegrationTypes(Integrations.GuildInstall)
	.setContexts(Contexts.Guild);

export default new Command({
	data: {
		...builder.toJSON(),
	},
	async execute(interaction) {
		const amount = interaction.options.getNumber("amount");

		try {
			await interaction.reply({
				content: `Clearing ${amount} messages...`,
				flags: [MessageFlags.Ephemeral],
			});

			await interaction.channel.messages
				.fetch({
					limit: amount,
				})
				?.then((messages) =>
					messages.forEach((message) => message.delete())
				)
				.finally(() => {
					return interaction.editReply({
						content: `Deleted ${amount} messages.`,
					});
				});

			return;
		} catch (error) {
			console.error(error);
			return interaction.editReply({
				content: `I was unable to clear the ${amount} messages for you, as I may not have the right permissions or the messages are too old.`,
			});
		}
	},
});
