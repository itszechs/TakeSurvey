import { useState } from "react";
import {
    Button, Card,
    Form, FormGroup,
    Input, Label
} from "reactstrap";

import "./HomePage.css";

export default function HomePage() {
    const [numberOfOptions, setNumberOfOptions] = useState(2);

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
                            type="text" />
                        <Label className="label" for="options">Options</Label>
                        {[...Array(numberOfOptions)].map((_, index) => (
                            <div className="options-container" key={index} >
                                <Input
                                    className="option-input"
                                    id={`option-${index}`}
                                    name={`option-${index}`}
                                    placeholder={`Option ${index + 1}`}
                                    type="text" />
                                <Button
                                    className="delete-button"
                                    color="danger"
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
                            onClick={() => setNumberOfOptions(numberOfOptions + 1)}
                        >Add option</Button>
                    </FormGroup>
                </Form>
            </Card>
            <Button className="submit-button" color="primary">Create</Button>
        </div >
    );
}