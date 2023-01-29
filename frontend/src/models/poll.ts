export interface Poll {
    title: string;
    options: PollOption[];
    _id?: string;
}

export interface PollOption {
    title: string;
    vote: number;
}
