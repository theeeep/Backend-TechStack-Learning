import { createClient } from "redis";

const client = createClient();

async function processSubmission(submission: string) {
	const { problemId, code, language } = JSON.parse(submission);

	const data = {
		problemId: problemId,
		code: code,
		language: language,
	};
	console.table(data);

	// Add your actual actual processing logic

	// Simulate processing delay
	await new Promise((resolve) => setTimeout(resolve, 1000));
	console.log(`Finished processing submission for problemId ${problemId}`);
}

async function startWorker() {
	try {
		await client.connect();
		console.log("Worker connected to Redis.");

		// Main Loop
		while (true) {
			try {
				const submission = await client.brPop("problems", 0);
				//@ts-ignore
				await processSubmission(submission.element);
			} catch (error) {
				console.error("Error processing submission: ", error);
			}
		}
	} catch (error) {
		console.error("Failed to connec to Redis", error);
	}
}

startWorker();
