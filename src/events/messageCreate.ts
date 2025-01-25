import { Events } from "discord.js";
import { ClientEvent } from "../lib/classes/Event";
import { db } from "../lib/db";
import guild from "../commands/info/guild";

export default new ClientEvent({
	name: Events.MessageCreate,
	once: false,
	async execute(interaction) {
		if (interaction.author.bot) return;

		if (!interaction.inGuild()) return;

		let Guild = await db.guild.findFirst({
			where: {
				id: interaction.guild.id,
			},
		});

		if (!Guild) {
			Guild = await db.guild.create({
				data: {
					id: interaction.guild.id,
					name: interaction.guild.name,
					ownerId: interaction.guild.ownerId,
					ownerName: (
						await interaction.guild.fetchOwner()
					).user.username,
				},
			});
		}

		if (!Guild.levelsEnabled) return;

		if (!Guild.levelLogChannelId) return;

		const minGain = 10;
		const maxGain = 100;
		const gain = Math.floor(Math.random() * (maxGain - minGain) + minGain);
		const levelUp = 10000;

		let Level = await db.levels.findFirst({
			where: {
				guildId: Guild.id,
				userId: interaction.member.user.id,
			},
		});

		if (!Level) {
			Level = await db.levels.create({
				data: {
					userId: interaction.member.user.id,
					userName: interaction.member.user.username,
					guildId: Guild.id,
				},
			});
		}

		const { xp, level, userId } = Level;

		let newXp = xp + gain;
		let newLevel = level;

		if (newXp >= levelUp) {
			newXp = Math.abs(newXp - levelUp);
			newLevel = level + 1;

			const logChannel = await interaction.guild.channels.fetch(
				Guild.levelLogChannelId
			);

			if (logChannel && logChannel.isTextBased()) {
				await logChannel.send({
					content: `<@!${userId}> just levelled up to level ${newLevel}! 🎉`,
				});
			}
		}

		await db.levels.update({
			data: {
				xp: newXp,
				level: newLevel,
			},
			where: {
				id: Level.id,
			},
		});

		return;
	},
});
