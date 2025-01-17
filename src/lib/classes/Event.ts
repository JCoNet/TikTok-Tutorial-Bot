import { ClientEvents } from "discord.js";

type TEventOptions<T extends keyof ClientEvents> = {
	name: T;
	once?: boolean;
	execute: (...args: ClientEvents[T]) => Promise<any> | any;
};

export class ClientEvent<T extends keyof ClientEvents = keyof ClientEvents> {
	name: T;
	once?: boolean;
	execute: (...args: ClientEvents[T]) => Promise<any> | any;

	constructor({ name, once, execute }: TEventOptions<T>) {
		(this.name = name), (this.once = once);
		this.execute = execute;
	}
}
