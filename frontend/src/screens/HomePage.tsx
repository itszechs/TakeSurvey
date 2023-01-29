import { useState } from "react";
import {
    Button, Card,
    Form, FormGroup,
    Input, Label, Spinner
} from "reactstrap";

import { API } from "../config/constants";

import "./HomePage.css";

export default function HomePage() {
    const [numberOfOptions, setNumberOfOptions] = useState(2);
    const [question, setQuestion] = useState<string>("");
    const [isCreating, setIsCreating] = useState(false);

    const getOptions = () => {
        const options: string[] = [];
        for (let i = 0; i < numberOfOptions; i++) {
            const option = (document.getElementById(`option-${i}`) as HTMLInputElement).value;
            if (option !== "") {
                options.push(option);
            }
        }
        return Array.from(new Set(options));
    }


    const createSurvey = () => {
        setIsCreating(true);
        const options = getOptions();

        if (question === "") {
            alert("Question cannot be empty.");
            setIsCreating(false);
            return;
        }
        if (options.length < 2) {
            alert("At least two unique options are required.");
            setIsCreating(false);
            return;
        }

        const survey = {
            title: question,
            options: options
        }

        fetch(`${API.base}${API.poll}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(survey)
        }).then(res => {
            if (res.ok) {
                return res.json();
            }
            return Promise.reject(res);
        }).then((response) => {
            const pollId = response.id;
            window.location.href = `/${pollId}`;
        }).catch(err => {
            err.json().then((error: any) => {
                alert(error.message)
            });
        }).finally(() => {
            setIsCreating(false);
        });
    }

    return (
        <div className="home-page">
            <h3 className="app-name" >TakeSurvery</h3>
            <p className="app-description">TakeSurvery is a simple survey app that allows you to create and share surveys with your friends.</p>
            <Card outline className="form-card">
                <h5>Create a new survey</h5>
                <Form>
                    <FormGroup>
                        <Label className="label" for="question">Question</Label>
                        <Input
                            id="question"
                            name="question"
                            placeholder="Type your question here..."
                            type="text"
                            onChange={(e) => { setQuestion(e.target.value); }}
                            value={question}
                            disabled={isCreating} />
                        <Label className="label" for="options">Options</Label>
                        {[...Array(numberOfOptions)].map((_, index) => (
                            <div className="options-container" key={index} >
                                <Input
                                    className="option-input"
                                    id={`option-${index}`}
                                    name={`option-${index}`}
                                    placeholder={`Option ${index + 1}`}
                                    disabled={isCreating}
                                    type="text" />
                                <Button
                                    className="delete-button"
                                    color="danger"
                                    disabled={isCreating}
                                    onClick={() => {
                                        if (numberOfOptions === 2) {
                                            alert("At least two options are required.");
                                            return;
                                        };

                                        const options: string[] = [];
                                        for (let i = 0; i < numberOfOptions; i++) {
                                            const option = (document.getElementById(`option-${i}`) as HTMLInputElement).value;
                                            options.push(option);
                                        };
                                        options.splice(index, 1);
                                        setNumberOfOptions(numberOfOptions - 1);
                                        for (let i = 0; i < options.length; i++) {
                                            (document.getElementById(`option-${i}`) as HTMLInputElement).value = options[i];
                                        }
                                    }}
                                >Delete</Button>
                            </div>
                        ))}
                        <Button block outline
                            color="dark"
                            disabled={isCreating}
                            onClick={() => setNumberOfOptions(numberOfOptions + 1)}
                        >Add option</Button>
                    </FormGroup>
                </Form>
            </Card>
            <Button
                className="submit-button"
                color="primary"
                disabled={isCreating}
                onClick={createSurvey} >
                {isCreating && <Spinner className="loading-spinner" size="sm">Creating...</Spinner>}
                {isCreating ? "Please wait..." : "Create"}
            </Button>
        </div >
    );
}