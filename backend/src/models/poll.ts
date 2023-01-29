import { ObjectId } from "mongodb";
import Joi from "joi";

export interface Poll {
    title: string;
    options: PollOption[];
    _id?: ObjectId;
}

export interface PollOption {
    title: string;
    vote: number;
}

export const pollSchema = Joi.object({
    title: Joi.string().required(),
    options: Joi.array().items(Joi.string())
});