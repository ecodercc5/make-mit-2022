import { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import { useEmotionsVideoState } from "../providers/EmotionsVideoStateProvider";
import { Emotions } from "../core/emotions";

export const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { setEmotion } = useEmotionsVideoState();

  useEffect(() => {
    console.log(videoRef);

    const getVideo = async () => {
      await Promise.all([
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      ]);

      const video = videoRef.current!;

      // access the users webcam and get the media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
      });

      console.log(stream);

      // set the srcObject
      video.srcObject = stream;

      // play the video
      video.play();
    };

    getVideo();
  }, []);

  return (
    <video
      className="absolute w-full h-full top-0 left-0"
      ref={videoRef}
      onPlaying={async () => {
        console.log("[on playing]");

        const intervalId = setInterval(async () => {
          // console.log("[on play]");

          // do ai magic
          // console.log("[doing ai magic]");

          const video = videoRef.current!;

          const facialExpressionDetection = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();

          if (facialExpressionDetection.length === 0) {
            return;
          }

          const expressions = facialExpressionDetection[0].expressions;
          const emotion = Emotions.getMostProbableEmotion(expressions);

          // console.log(expressions);
          // console.log(emotion);

          console.log("[setting emotion]");

          setEmotion(emotion);
        }, 1000);

        // setTimeout(() => window.clearInterval(intervalId), 5000);
      }}
    />
  );
};
