import "./App.css";
import * as faceapi from "face-api.js";
import { VideoBackground } from "./components/VideoBackground";

function App() {
  return (
    <div className="App">
      <h1>Make MIT 2022</h1>
      <VideoBackground />
    </div>
  );
}

export default App;
