import {
	SlashCommandBuilder,
	ApplicationIntegrationType as Integrations,
	InteractionContextType as Contexts,
	PermissionFlagsBits,
	MessageFlags,
} from "discord.js";
import { Command } from "../../lib/classes/Command";

const builder = new SlashCommandBuilder()
	.setName("kick")
	.setDescription("Kick a user from your guild (server)")
	.setContexts(Contexts.Guild)
	.setIntegrationTypes(Integrations.GuildInstall)
	.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
	.addUserOption((option) =>
		option
			.setName("user")
			.setDescription("The user to kick")
			.setRequired(true)
	)
	.addStringOption((option) =>
		option
			.setName("reason")
			.setDescription("The reason for the kick")
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
					"You must provide both a user and a reason to kick them.",
				flags: [MessageFlags.Ephemeral],
			});
		}

		try {
			const member = await interaction.guild.members.fetch(user.id);
			if (!member.kickable) {
				console.log("User not kickable");
				interaction.reply({
					content:
						"There was an issue kicking that user. They may have a role or permission higher than this bot or are an administrator.",
					flags: [MessageFlags.Ephemeral],
				});
			}

			await member.kick(reason);
		} catch (error) {
			console.error("Error:", error);
			interaction.reply({
				content: "There was an issue kicking that user.",
				flags: [MessageFlags.Ephemeral],
			});
		}

		interaction.reply({
			content: `User ${user.username} has been kicked for ${reason}.`,
		});
	},
});
