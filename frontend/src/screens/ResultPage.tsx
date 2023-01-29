import "./ResultPage.css";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    Alert, Badge,
    Button, Spinner, Fade,
    ListGroup, ListGroupItem
} from "reactstrap";

import { API } from "../config/constants";
import { State } from "../config/state";
import { Poll, PollOption } from "../models/poll";

import AnimatedProgressBar from "../components/AnimatedProgressBar";

interface Option {
    title: string;
    votes: number;
    percentage: number;
}

export default function ResultPage() {
    let { pollId } = useParams();
    const [poll, setPoll] = useState<Poll | null>(null);
    const [options, setOptions] = useState<Option[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [state, setState] = useState<State>(State.NONE);
    const [message, setMessage] = useState("");

    const fetchSurvey = async () => {
        setIsLoading(true);
        setState(State.NONE);
        setMessage("");
        fetch(`${API.base}${API.poll}/${pollId}`)
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                return Promise.reject(res);
            }).then((response) => {
                setPoll(response);
                let totalVotes = 0;
                response.options.forEach((option: PollOption) => {
                    totalVotes += Number(option.vote);
                });

                let options = response.options.map((option: PollOption) => {
                    return {
                        title: option.title,
                        votes: option.vote,
                        percentage: Math.round(Number(option.vote) / totalVotes * 100)
                    }
                });
                setOptions(options);
            }).catch((error) => {
                console.log(error);
                setState(State.ERROR);
                let errorMessage = error.message ? error.message : "Something went wrong.";
                setMessage(`Error fetching poll.\n${errorMessage}`);
            }).finally(() => {
                setIsLoading(false);
            });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchSurvey(); }, []);

    let dismissAlert: any = null;
    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setState(State.SUCCESS);
        setMessage("Link copied to clipboard.");

        if (dismissAlert) {
            clearTimeout(dismissAlert);
        };

        dismissAlert = setTimeout(() => {
            setState(State.NONE);
            setMessage("");
        }, 5000);
    };
    return (
        <div className="result-container" >
            {isLoading ?
                <Spinner className="result-loading-spinner" color="primary" />
                : poll && <Fade tag="div">
                    <div className="result">
                        <h3>{poll?.title}</h3>
                        {options.map((option) => (
                            <ListGroup key={option.title}>
                                <ListGroupItem className="result-list-item" >{option.title}
                                    <Badge
                                        pill
                                        className="item-badge text-dark"
                                        color="light"
                                    >{option.votes} vote{option.votes > 1 ? "s" : ""}
                                    </Badge>
                                    <AnimatedProgressBar duration={700} finalValue={option.percentage} />
                                </ListGroupItem>
                            </ListGroup>
                        ))}
                        <Button
                            className="share-button"
                            color="link"
                            onClick={copyLink}
                        >Share</Button>
                    </div>
                </Fade>
            }
            {message !== "" ?
                <Alert
                    className="result-alert "
                    color={
                        state === State.SUCCESS ? "success" :
                            state === State.ERROR ? "danger" : "dark"
                    }
                > {message}
                </Alert> : ""
            }
        </div>

    );
}