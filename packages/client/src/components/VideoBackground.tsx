import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

export const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log(videoRef);

    const getVideo = async () => {
      await faceapi.loadFaceExpressionModel("../models");

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

      // do ai magic
      const facialExpressionDetection = await faceapi
        .detectAllFaces(video)
        .withFaceExpressions();

      console.log(facialExpressionDetection);
    };

    getVideo();
  }, []);

  return (
    <div>
      <video ref={videoRef} />
    </div>
  );
};
