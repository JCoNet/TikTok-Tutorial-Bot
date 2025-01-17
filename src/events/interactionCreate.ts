import { Events, PermissionFlagsBits as Permissions } from "discord.js";
import { ClientEvent } from "../lib/classes/Event";
import { bot } from "..";

export default new ClientEvent({
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction) {
		// Chat input command interactions
		if (interaction.isChatInputCommand()) {
			const command = bot.commands.get(interaction.commandName);

			if (!command) {
				return interaction.reply({
					content: "You have used a command that does not exist.",
					ephemeral: true,
				});
			}

			return command.execute(interaction);
		}

		// Modal input interactions
		if (interaction.isModalSubmit()) {
			const data = interaction.customId.split("-");
			const userId = data[0];
			const channelId = data[1];
			const modalCommand = data[2];
			const message = interaction.fields.getTextInputValue(
				`${userId}-${channelId}-message`
			);

			if (modalCommand === "say") {
				const channel = await interaction.guild.channels.fetch(
					channelId
				);
				const user = await interaction.guild.members.fetch(userId);

				if (user.permissions.has(Permissions.ManageMessages)) {
					const res = await fetch("https://vector.profanity.dev", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ message }),
					});

					const result = (await res.json()) as {
						isProfanity: string;
						score: number;
						flaggedFor?: string | string[] | undefined;
					};

					console.log(result);

					if (result.isProfanity) {
						return interaction.reply({
							content:
								"Please do not try to make me use profanity.",
							ephemeral: true,
						});
					}

					if (channel.isTextBased()) {
						channel
							.send({
								content: message,
							})
							.catch((err) => {
								return interaction.reply({
									content: "An error occured: " + err,
									ephemeral: true,
								});
							});

						return interaction.reply({
							content: "Message sent!",
							ephemeral: true,
						});
					}

					return interaction.reply({
						content:
							"The channel you want me to send the message in is not text based or I do not have access to it.",
						ephemeral: true,
					});
				}

				return interaction.reply({
					content:
						"You do not have the required permissions to use this command.",
					ephemeral: true,
				});
			}

			return interaction.reply({
				content:
					"Unrecognised modal form submission, please try again.",
				ephemeral: true,
			});
		}
	},
});
