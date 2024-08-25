import { Queue, Worker } from "bullmq";
import express from "express";

const app = express();
const PORT = 3001;
app.use(express.json());

const userDb = [
	{
		id: 1,
		name: "Deepak",
		password: "123456",
		email: "deepak@mail.com",
	},
];

const verificationWorker = new Worker(
	"user-verification-queue",
	(job) => {
		const userId = job.data.userId;
		console.log(`Job received userId : ${userId} with jobId is ${job.id}`);

		const isValidUser = userDb.some((item) => item.id === userId);

		const { password, ...rest } = userDb[0];
		return { isValidUser, rest };
	},
	{
		connection: {
			host: "127.0.0.1",
			port: 6379,
		},
	},
);

app.listen(PORT, () => console.log("User Server started at port 3001"));
