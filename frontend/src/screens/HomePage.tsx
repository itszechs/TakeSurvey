import {
    Button, Card,
    Form, FormGroup,
    Input, Label
} from "reactstrap";
import "./HomePage.css";

export default function HomePage() {
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
                    </FormGroup>
                </Form>
            </Card>
            <Button className="submit-button" color="primary">Create</Button>
        </div >
    );
}