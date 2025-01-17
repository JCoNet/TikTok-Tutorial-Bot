import { TCommand } from "../types/Command";

export class Command {
	constructor(commandOptions: TCommand) {
		Object.assign(this, commandOptions);
	}
}
