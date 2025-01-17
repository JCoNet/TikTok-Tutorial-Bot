import {
	SlashCommandBuilder,
	ApplicationIntegrationType as Integrations,
	InteractionContextType as Contexts,
	EmbedBuilder,
	Colors,
} from "discord.js";
import { Command } from "../../lib/classes/Command";

const builder = new SlashCommandBuilder()
	.setName("guild-info")
	.setDescription("View information about the guild.")
	.setIntegrationTypes(Integrations.GuildInstall)
	.setContexts(Contexts.Guild)
	.addBooleanOption((option) =>
		option
			.setName("include-user-presences")
			.setRequired(true)
			.setDescription(
				"Show the presence data counts of users in the guild?"
			)
	);

export default new Command({
	data: {
		...builder.toJSON(),
	},
	async execute(interaction) {
		const includeUserPreseces = interaction.options.getBoolean(
			"include-user-presences"
		);
		const { guild, user } = interaction;

		const channelCount = guild.channels.cache?.size;
		const roleCount = guild.roles.cache?.size;
		const emojiCount = guild.emojis.cache?.size;
		const stickerCount = guild.stickers.cache?.size;

		const embed = new EmbedBuilder()
			.setColor(Colors.DarkAqua)
			.setAuthor({
				name: `${user.displayName}`,
				iconURL: user.displayAvatarURL({
					extension: "png",
					size: 1024,
				}),
			})
			.setTitle(`About **${guild.name}**`)
			.setThumbnail(
				guild.iconURL({
					extension: "png",
					size: 1024,
				})
			)
			.setTimestamp()
			.setDescription(
				"Here is the most recent information about this guild."
			)
			.setFields([
				{ name: "Guild Id", value: `${guild.id}`, inline: true },
				{
					name: "Guild Owner",
					value: `${(await guild.fetchOwner()).displayName}`,
					inline: true,
				},
				{
					name: "Guild Users",
					value: `${guild.memberCount}`,
					inline: true,
				},
				{
					name: "Guild Channels",
					value: `${channelCount}`,
					inline: true,
				},
				{
					name: "Guild Roles",
					value: `${roleCount}`,
					inline: true,
				},
				{ name: "Guild Emojis", value: `${emojiCount}`, inline: true },
				{
					name: "Guild Stickers",
					value: `${stickerCount}`,
					inline: true,
				},
			]);

		if (includeUserPreseces) {
			const online = guild.presences.cache?.filter(
				(data) => data.status === "online"
			)?.size;
			const dnd = guild.presences.cache?.filter(
				(data) => data.status === "dnd"
			)?.size;
			const idle = guild.presences.cache?.filter(
				(data) => data.status === "idle"
			)?.size;
			const offline = guild.presences.cache?.filter(
				(data) => data.status === "offline"
			)?.size;

			embed.addFields([
				{ name: "User Information", value: "\u200b", inline: false },
				{ name: "Online Users", value: `${online}`, inline: true },
				{ name: "DND Users", value: `${dnd}`, inline: true },
				{ name: "Idle Users", value: `${idle}`, inline: true },
				{ name: "Offline Users", value: `${offline}`, inline: true },
			]);
		}

		return interaction.reply({
			embeds: [embed],
		});
	},
});
