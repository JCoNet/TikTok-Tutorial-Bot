import {
	APIInteractionGuildMember,
	CacheType,
	ChatInputCommandInteraction,
	GuildMember,
	RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";

export interface IExtendedInteraction
	extends ChatInputCommandInteraction<CacheType> {
	member: GuildMember | APIInteractionGuildMember;
}

type TExecute = (interaction: IExtendedInteraction) => any;

export type TCommand = {
	data: RESTPostAPIChatInputApplicationCommandsJSONBody;
	execute: TExecute;
};
