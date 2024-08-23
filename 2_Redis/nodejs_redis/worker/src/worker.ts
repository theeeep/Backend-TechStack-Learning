import { createClient } from "redis";

const client = createClient();

async function main() {
	await client.connect();
	console.log("Worker connected to Redis.");

	while (true) {
		const response = await client.brPop("problems", 0);
		console.log(response);

		await new Promise((resolve) => setTimeout(resolve, 1000));

		console.log("Process users submitted");
	}
}

main();
