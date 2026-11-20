import React from "react";
import { AudioRecorder } from "./components/AudioRecorder";
import { UploadClip } from "./components/UploadClip";

export const App: React.FC = () => {
  return (
    <main>
      <h1>Yappify</h1>
      <AudioRecorder />
      <UploadClip />
    </main>
  );
};

export default App;
