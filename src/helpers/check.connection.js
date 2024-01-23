"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECONDS = 5000;

// count connect
const countConnect = () => {
  const countConnection = mongoose.connections.length; // count connection
  console.log(`Nunber connection to db ::: ${countConnection}`);
};
// check overload
const checkOverload = () => {
  setInterval(() => {
    const numberConnection = mongoose.connections.length;
    const numCores = os.cpus.length;
    const memoryUsage = process.memoryUsage().rss;

    console.log(`Active connection:: ${numberConnection}`);
    console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`);
    // fake maximum number connection based on number of cores
    const maxConnections = numCores * 5;
    if (numberConnection > maxConnections) {
      console.log(`Connection DB overload detected!!`);
    }
  }, _SECONDS);
};
module.exports = { countConnect, checkOverload };
