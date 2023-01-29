import { ObjectId } from "mongodb";

export interface Poll {
    title: string;
    options: PollOption[];
    _id?: ObjectId;
}

export interface PollOption {
    title: string;
    vote: number;
}
