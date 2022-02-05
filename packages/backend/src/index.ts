import express from "express";
import { Server } from "socket.io";
import http from "http";
import { Board, Led, Stepper } from "johnny-five";

// set up server
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// global container for johnny-5 stuff
interface IArduinoContainer {
  stepper?: Stepper;
  initialized: boolean;
}

const arduino: IArduinoContainer = { initialized: false };

const run = (
  arduino: IArduinoContainer,
  runFunc: (arduino: IArduinoContainer) => any
) => {
  if (!arduino.initialized) {
    return;
  }

  return runFunc(arduino);
};

// set up arduino stuff
const board = new Board();

board.on("ready", () => {
  console.log("[on board ready]");

  const led = new Led(13);

  const stepper = new Stepper({
    type: Stepper.TYPE.FOUR_WIRE,
    stepsPerRev: 200,
    pins: [10, 11, 12, 13],
    rpm: 180,
  });

  // set stepper
  arduino.initialized = true;
  arduino.stepper = stepper;

  led.blink(1000);

  //   stepper.rpm(180).cw();

  //   stepper.step(200, () => console.log("spinning"));

  //   stepper.cw();

  //   setInterval(() => {
  //     stepper.step(1, () => console.log("spinning"));
  //   }, 250);
});

let intervalId: NodeJS.Timer | null = null;

// set up websocket
io.on("connection", (socket) => {
  console.log("on connection");

  socket.on("rotate:right", () => {
    console.log("[rotate right]");

    run(arduino, (arduino) => {
      if (intervalId) {
        clearInterval(intervalId);
      }

      intervalId = setInterval(() => {
        arduino.stepper?.cw().step(200, () => console.log("[spinning]"));
      }, 333);
    });
  });

  socket.on("rotate:left", () => {
    console.log("[rotate left]");

    if (intervalId) {
      clearInterval(intervalId);
    }

    intervalId = setInterval(() => {
      arduino.stepper?.ccw().step(200, () => console.log("[spinning]"));
    }, 333);
  });
});

httpServer.listen(8000, () => console.log("Listening on port 8000"));
