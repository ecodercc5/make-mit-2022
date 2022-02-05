"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var socket_io_1 = require("socket.io");
var http_1 = __importDefault(require("http"));
var johnny_five_1 = require("johnny-five");
// set up server
var app = (0, express_1.default)();
var httpServer = http_1.default.createServer(app);
var io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
    },
});
var arduino = { initialized: false };
var run = function (arduino, runFunc) {
    if (!arduino.initialized) {
        return;
    }
    return runFunc(arduino);
};
// set up arduino stuff
var board = new johnny_five_1.Board();
board.on("ready", function () {
    console.log("[on board ready]");
    var led = new johnny_five_1.Led(13);
    var stepper = new johnny_five_1.Stepper({
        type: johnny_five_1.Stepper.TYPE.FOUR_WIRE,
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
var intervalId = null;
// set up websocket
io.on("connection", function (socket) {
    console.log("on connection");
    socket.on("rotate:right", function () {
        console.log("[rotate right]");
        run(arduino, function (arduino) {
            if (intervalId) {
                clearInterval(intervalId);
            }
            intervalId = setInterval(function () {
                var _a;
                (_a = arduino.stepper) === null || _a === void 0 ? void 0 : _a.cw().step(200, function () { return console.log("[spinning]"); });
            }, 333);
        });
    });
    socket.on("rotate:left", function () {
        console.log("[rotate left]");
        if (intervalId) {
            clearInterval(intervalId);
        }
        intervalId = setInterval(function () {
            var _a;
            (_a = arduino.stepper) === null || _a === void 0 ? void 0 : _a.ccw().step(200, function () { return console.log("[spinning]"); });
        }, 333);
    });
});
httpServer.listen(8000, function () { return console.log("Listening on port 8000"); });
