import { VideoBackground } from "./components/VideoBackground";
import { useEmotionsVideoState } from "./providers/EmotionsVideoStateProvider";

const App = () => {
  const { emotionsVideoState } = useEmotionsVideoState();

  return (
    <div className="App">
      <h1>Make MIT 2022</h1>
      <VideoBackground />
      <h2>Emotion: {emotionsVideoState.emotion}</h2>
    </div>
  );
};

export default App;
