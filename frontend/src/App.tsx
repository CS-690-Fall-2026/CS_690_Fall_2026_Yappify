import React from "react";
import { AudioRecorder } from "./components/AudioRecorder";

export const App: React.FC = () => {
  return (
    <main>
      <h1>Yappify</h1>
      <AudioRecorder />
    </main>
  );
};

export default App;
