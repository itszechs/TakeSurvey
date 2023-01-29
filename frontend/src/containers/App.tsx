import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../screens/HomePage";
import PollPage from "../screens/PollPage";
import ResultPage from "../screens/ResultPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:pollId" element={<PollPage />} />
        <Route path="/:pollId/results" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  );
}
