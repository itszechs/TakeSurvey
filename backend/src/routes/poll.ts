import express, { Request, Response, Router } from "express";
import { collections } from "../services/database";
import { Poll, PollOption, pollSchema } from "../models/poll";
import { ObjectId } from "mongodb";

export const pollRouter = Router();
pollRouter.use(express.json());

/*
    * GET /poll/:id
    * Returns poll by survey id
    * Returns 404 if the poll is not found
*/
pollRouter.get("/:id", async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id;
        const poll = await collections.polls.findOne(
            { _id: new ObjectId(id) }
        );
        console.log(poll)

        if (poll) {
            res.status(200).send(poll);
        } else {
            res.status(404).send({ message: "Poll does not exist" });
        }

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

/*
    * POST /poll
    * Creates a new poll
    * Returns 201 if the poll is created
    * Returns 400 if the poll body is invalid
*/
pollRouter.post("/", async (req: Request, res: Response) => {
    try {
        const { error } = pollSchema.validate(req.body);
        if (error) {
            res.status(400).send({ message: "Invalid request" });
            return;
        }

        const poll = req.body;
        
        const unique = [...new Set(poll.options)];
        if (unique.length !== poll.options.length) {
            res.status(400).send({ message: "Poll options must be unique" });
            return;
        }

        const pollOption: PollOption[] = poll.options.map((option) => {
            const _pollOption: PollOption = {
                title: option as string,
                vote: 0
            }
            return _pollOption;
        });

        const newPoll: Poll = {
            _id: new ObjectId(poll._id),
            title: poll.title,
            options: pollOption
        };
        const result = await collections.polls.insertOne(newPoll);

        if (result.acknowledged) {
            res.status(201).send({ id: result.insertedId, message: "New poll created" });
        } else {
            res.status(500).send({ message: "Failed to create poll" });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


/*
    * PATCH /poll/:id
    * Returns poll by survey id
    * Returns 404 if the poll is not found
*/
pollRouter.patch("/:id", async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id;
        const poll = await collections.polls.findOne(
            { _id: new ObjectId(id) }
        );
        console.log(poll);

        if (!poll) {
            res.status(404).send({ message: "Poll does not exist" });
        }

        const vote = req.body.vote;
        if (!vote) {
            res.status(400).send({ message: "Invalid vote body" });
            return;
        }

        let optionIndex = -1;
        const isValidOption = poll.options.some((option) => {
            if (option.title === vote) {
                optionIndex = poll.options.indexOf(option);
                return true;
            }
            return false;
        });

        if (!isValidOption) {
            res.status(400).send({ message: "Invalid vote" });
            return;
        }

        const result = await collections.polls.updateOne(
            { _id: new ObjectId(id) },
            { $inc: { [`options.${optionIndex}.vote`]: 1 } }
        );
        if (result.acknowledged) {
            res.status(200).send({ message: "Vote updated" });
        } else {
            res.status(500).send({ message: "Failed to update vote" });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});