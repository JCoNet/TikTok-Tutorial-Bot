import {
	PermissionFlagsBits,
	SlashCommandBuilder,
	ApplicationIntegrationType as Integrations,
	InteractionContextType as Contexts,
	MessageFlags,
} from "discord.js";
import { Command } from "../../lib/classes/Command";

const builder = new SlashCommandBuilder()
	.setName("ban")
	.setDescription("Ban a user from your guild (server)")
	.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
	.setIntegrationTypes(Integrations.GuildInstall)
	.setContexts(Contexts.Guild)
	.addUserOption((option) =>
		option
			.setName("user")
			.setDescription("The user to ban")
			.setRequired(true)
	)
	.addStringOption((option) =>
		option
			.setName("reason")
			.setDescription("The reason for the ban")
			.setRequired(true)
	);

export default new Command({
	data: {
		...builder.toJSON(),
	},

	async execute(interaction) {
		const user = interaction.options.getUser("user");
		const reason = interaction.options.getString("reason");

		if (!user || !reason) {
			return interaction.reply({
				content:
					"You must provide both a user and a reason to ban them.",
				flags: [MessageFlags.Ephemeral],
			});
		}

		try {
			const member = await interaction.guild.members.fetch(user.id);
			if (!member.bannable) {
				console.log("User not bannable");
				interaction.reply({
					content:
						"There was an issue banning that user. They may have a role or permission higher than this bot or are an administrator.",
					flags: [MessageFlags.Ephemeral],
				});
			}

			await member.ban({ reason });
		} catch (error) {
			console.error("Error:", error);
			interaction.reply({
				content: "There was an issue banning that user.",
				flags: [MessageFlags.Ephemeral],
			});
		}

		interaction.reply({
			content: `User ${user.username} has been banned for ${reason}.`,
		});
	},
});
