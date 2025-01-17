import {
	ApplicationIntegrationType as Integrations,
	InteractionContextType as Contexts,
	SlashCommandBuilder,
	PermissionFlagsBits as Permissions,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ActionRowBuilder,
	ModalActionRowComponentBuilder,
} from "discord.js";
import { Command } from "../../lib/classes/Command";

const builder = new SlashCommandBuilder()
	.setName("say")
	.setDescription("Send a message as the bot.")
	.setIntegrationTypes(Integrations.GuildInstall)
	.setContexts(Contexts.Guild)
	.setDefaultMemberPermissions(Permissions.ManageMessages);

export default new Command({
	data: {
		...builder.toJSON(),
	},
	async execute(interaction) {
		const modal = new ModalBuilder()
			.setCustomId(`${interaction.user.id}-${interaction.channel.id}-say`)
			.setTitle("Send a message as me 😊");

		const messageInput = new TextInputBuilder()
			.setCustomId(
				`${interaction.user.id}-${interaction.channel.id}-message`
			)
			.setLabel("What would you like me to say on your behalf?")
			.setStyle(TextInputStyle.Paragraph)
			.setMinLength(5)
			.setMaxLength(3500)
			.setRequired()
			.setPlaceholder("Enter your message here...");

		const row =
			new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
				messageInput
			);
		modal.addComponents(row);

		return interaction.showModal(modal);
	},
});
