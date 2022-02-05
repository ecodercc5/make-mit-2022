import { VideoBackground } from "./components/VideoBackground";
import { useEmotionsVideoState } from "./providers/EmotionsVideoStateProvider";
import { socket } from "./web-socket";

socket.on("connect", () => {
  console.log("[on connect]");
});

const App = () => {
  const { emotionsVideoState } = useEmotionsVideoState();

  return (
    <div className="App">
      <h1>Make MIT 2022</h1>
      {/* <VideoBackground /> */}
      <h2>Emotion: {emotionsVideoState.emotion}</h2>

      <button
        onClick={() => {
          console.log("on click");
          socket.emit("rotate:right");
        }}
      >
        Rotate right
      </button>
      <button
        onClick={() => {
          console.log("on click");
          socket.emit("rotate:left");
        }}
      >
        Rotate left
      </button>
    </div>
  );
};

export default App;
