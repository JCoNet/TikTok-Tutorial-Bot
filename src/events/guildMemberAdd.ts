import { Events } from "discord.js";
import { ClientEvent } from "../lib/classes/Event";

export default new ClientEvent({
	name: Events.GuildMemberAdd,
	once: false,
	async execute({ guild, user }) {
		const channel = guild.channels.cache.get(guild.systemChannelId);
		if (!channel.isTextBased()) return;

		return channel.send({
			content: `# Welcome <@!${user.id}>!\nThank your for joining ***${guild.name}***`,
		});
	},
});
