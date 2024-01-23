"use strict";
const mongoose = require("mongoose");
const {
  db: { host, name, port },
} = require("../configs/config.mongoDb");
const connectUrl = `mongodb://admin:LetMeAccessDbPass@${host}:${port}/${name}?serverSelectionTimeoutMS=2000&authSource=admin&directConnection=true`;
const { countConnect } = require("../helpers/check.connection");

class Database {
  constructor() {
    this.connect();
  }
  // connect method db
  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectUrl, {
        maxPoolSize: 50,
      })
      .then((_) => console.log(`Connect MongoDb success :: !!`), countConnect())
      .catch((err) => {
        console.log(err);
      });
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
const instanceMongoDb = Database.getInstance();
module.exports = instanceMongoDb;
