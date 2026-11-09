import { AudioRecorderUI } from "./components/AudioRecorderVanilla";

const root = document.getElementById("root");
if (root) {
  new AudioRecorderUI(root);
}
