import { Worker } from "bullmq";
import express from "express";

const app = express();
const PORT = 3002;
app.use(express.json());

const mailWorker = new Worker(
	"mail-queue",
	(job) => {
		console.log(`Mail Job received  with jobId is ${job.id}`);
	},
	{
		connection: {
			host: "127.0.0.1",
			port: 6379,
		},
	},
);

app.listen(PORT, () => console.log("Mail Server started at port 3002"));
