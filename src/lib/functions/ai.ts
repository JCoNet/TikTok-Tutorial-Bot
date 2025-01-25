import Groq from "groq-sdk";
import { ChatCompletionSystemMessageParam } from "groq-sdk/resources/chat/completions";

export const ai = new Groq({
	apiKey: process.env.GROQ_API_KEY,
	maxRetries: 3,
	timeout: 30000,
});

const MODEL = "llama-3.3-70b-versatile";

const SYSTEM: ChatCompletionSystemMessageParam = {
	role: "system",
	content:
		"You are a friendly and helpful chatbot running inside a discord bot. You are to be professional and always come up with the best solutions to any problem put to you. You should only ever refer to yourself as Helpy, the chat assistant.",
};

export const getCompletion = async ({
	prompt,
	username,
}: {
	prompt: string;
	username: string;
}) => {
	const { isProfanity } = (await (
		await fetch("https://vector.profanity.dev", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ message: prompt }),
		})
	).json()) as {
		isProfanity: string;
		score: number;
		flaggedFor?: string | string[] | undefined;
	};

	if (isProfanity) {
		return;
	}

	const completion = await ai.chat.completions.create({
		model: MODEL,
		temperature: 0.6,
		max_completion_tokens: 1000,
		max_tokens: 2000,
		top_p: 1,
		stop: null,
		stream: false,
		messages: [
			SYSTEM,
			{
				role: "user",
				content: prompt,
				name: username,
			},
		],
	});

	console.log({
		tokens: completion.usage.total_tokens,
		prompt: completion.usage.prompt_tokens,
		response: completion.usage.completion_tokens,
	});

	return completion.choices[0].message.content;
};
