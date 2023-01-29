import { useState, useEffect } from "react";
import { Progress } from "reactstrap";

import "./AnimatedProgressBar.css";

interface AnimatedProgressBarProps {
  finalValue: number;
  duration?: number;
}

export default function AnimatedProgressBar(props: AnimatedProgressBarProps) {
  let { finalValue, duration } = props;

  if (finalValue < 0 || finalValue > 100) {
    throw new Error("finalValue must be between 0 and 100");
  }

  if (!duration) {
    duration = 1000;
  }

  const [value, setValue] = useState(0);

  useEffect(() => {
    let interval: any;
    if (value < finalValue) {
      interval = setInterval(() => {
        setValue((prevValue) => prevValue + 1);
      }, duration! / finalValue);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [value, finalValue, duration]);

  return (
    <Progress
      className="progress"
      color="info"
      value={value}>
      <span className="progress-label">{value}%</span>
    </Progress>
  );
}
