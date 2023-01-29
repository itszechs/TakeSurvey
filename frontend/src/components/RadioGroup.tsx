import React, { useState } from "react";
import { Label, Input, ListGroupItem, ListGroup } from "reactstrap";
import { PollOption } from "../models/poll";

import "./RadioGroup.css";

interface Props {
    options: PollOption[],
    onChange: (value: string) => void;
}

export default function RadioGroup(props: Props) {
    const [selected, setSelected] = useState<string | undefined>();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelected(event.target.value);
        props.onChange(event.target.value);
    }

    return (
        <ListGroup className="radio-group">
            {props.options.map((option) => (
                <ListGroupItem className="radio-item">
                    <Label key={option.title} check>
                        <Input
                            className="radio-input"
                            type="radio"
                            name="radio"
                            value={option.title}
                            onChange={handleChange}
                            checked={selected === option.title}
                        />{" "}
                        {option.title}
                    </Label>
                </ListGroupItem>
            ))}
        </ListGroup>
    );
};
