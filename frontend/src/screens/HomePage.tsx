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
                                >Delete</Button>
                            </div>
                        ))
                        }
                    </FormGroup>
                </Form>
            </Card>
            <Button className="submit-button" color="primary">Create</Button>
        </div >
    );
}