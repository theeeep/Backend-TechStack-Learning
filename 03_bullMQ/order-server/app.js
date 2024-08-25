import { Queue, QueueEvents } from "bullmq";
import express from "express";

const app = express();
const PORT = 3000;
app.use(express.json());

// User-Queue
const verifyUser = new Queue("user-verification-queue");
const verificationQueueEvents = new QueueEvents("user-verification-queue");

// Mail-Queue
const mailQueue = new Queue("mail-queue");

const checkUserVerification = (jobId) => {
	return new Promise((resolve, reject) => {
		verificationQueueEvents.on(
			"completed",
			({ jobId: completedJobId, returnvalue }) => {
				if (jobId === completedJobId) {
					const { isValidUser, rest } = returnvalue;
					resolve({ isValidUser, rest });
				}
			},
		);
		verificationQueueEvents.on(
			"failed",
			({ jobId: failedJobId, failedReason }) => {
				if (jobId === failedJobId) {
					reject(new Error(failedReason));
				}
			},
		);
	});
};

app.post("/order", async (req, res) => {
	try {
		const { orderId, productName, price, userId } = req.body;

		const job = await verifyUser.add("Verify User", { userId });

		const { isValidUser, rest } = await checkUserVerification(job.id);

		if (!isValidUser) {
			return res.send({
				message: "User not valid!",
			});
		}
		// save order to database
		const mailJob = await mailQueue.add("Send Mail", {
			from: "laxmichitfund@gmail.com",
			to: rest.email,
			subject: "Thank you for Shopping with us!",
			body: "Your order successfully placed. Happy Shopping:)",
		});

		res.send({
			message: "User is valid",
			mailJob: mailJob.id,
			rest,
		});
	} catch (error) {
		console.log(error);
	}
});

app.listen(PORT, () => console.log("Order Server started at port 3000"));
