import "./PollPage.css";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Alert, Button, Fade, Spinner } from "reactstrap";

import { API } from "../config/constants";
import { State } from "../config/state";
import { Poll } from "../models/poll";

import RadioGroup from "../components/RadioGroup";


export default function PollPage() {
    let { pollId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [poll, setPoll] = useState<Poll | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [state, setState] = useState<State>(State.NONE);
    const [message, setMessage] = useState("");
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const fetchSurvey = () => {
        fetch(`${API.base}${API.poll}/${pollId}`)
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                return Promise.reject(res);
            }).then((response) => {
                setPoll(response);
            }).catch((error) => {
                setState(State.ERROR);
                setMessage(`Error fetching poll.\n${error.message}}`);
            }).finally(() => {
                setIsLoading(false);
            });
    };
    const submitVote = () => {
        setIsSubmitting(true);

        if (!selectedOption) {
            setIsSubmitting(false);
            setState(State.ERROR);
            setMessage(`Please select an option.`);
            return;
        }

        setState(State.NONE);
        setMessage("");

        fetch(`${API.base}${API.poll}/${pollId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                vote: selectedOption
            })
        }).then(res => {
            if (res.ok) {
                return res.json();
            }
            return Promise.reject(res);
        }).then((_) => {
            setHasSubmitted(true);
            setState(State.SUCCESS);
            setMessage(`Successfully submitted.`);
            setInterval(() => {
                window.location.href = `/${pollId}/results`;
            }, 1000);
        }).catch((error) => {
            setState(State.ERROR);
            let errorMessage = error.message ? error.message : "Something went wrong.";
            setMessage(`Error submitting poll.\n${errorMessage}`);
        }).finally(() => {
            setIsSubmitting(false);
        });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchSurvey(); }, []);

    return (
        <div className="poll-container">
            {isLoading ? <Spinner className="loading-spinner" color="primary" />
                : poll &&
                <Fade tag="div">
                    <div className="poll">
                        <h3>{poll?.title}</h3>
                        <RadioGroup
                            options={poll?.options || []}
                            onChange={(selectedId: string) => {
                                setSelectedOption(selectedId);
                            }} />
                        <Button
                            className="poll-submit-button"
                            disabled={isSubmitting || hasSubmitted}
                            color="primary"
                            onClick={submitVote}
                        >{isSubmitting && <Spinner
                            className="poll-submit-spinner"
                            size="sm">Submitting...</Spinner>}
                            {isSubmitting ? "Please wait..." :
                                hasSubmitted ? "Submitted!" : "Submit"}
                        </Button>
                    </div>
                </Fade>
            }
            {message !== "" ?
                <Alert
                    className="result-alert"
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