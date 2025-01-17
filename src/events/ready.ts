import { Events } from "discord.js";
import { ClientEvent } from "../lib/classes/Event";

export default new ClientEvent({
	name: Events.ClientReady,
	once: true,
	async execute({ user }) {
		return console.log(`${user.username} is ready for use.`);
	},
});
