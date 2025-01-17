declare global {
	namespace NodeJS {
		interface ProcessEnv {
			ENVIRONMENT: "dev" | "prod" | "debug";
			DATABASE_URL: string;
			DISCORD_TOKEN: string;
			DISCORD_CLIENT_ID: string;
			DISCORD_DEV_GUILD_ID: string;
		}
	}
}

export {};
