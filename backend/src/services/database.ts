import { MongoClient, Collection } from "mongodb";
import { Poll } from "../models/poll";

export const collections: {
    polls?: Collection<Poll>;
} = {};

export async function connectToDatabase(uri: string) {
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("TakeSurvey");

    collections.polls = db.collection<Poll>("polls");
}
