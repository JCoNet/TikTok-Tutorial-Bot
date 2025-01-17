import { TCommand } from "./Command";

export interface ICommandOptions {
	guildId?: string;
	commands: TCommand[];
}
