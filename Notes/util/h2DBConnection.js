const {MongoMemoryServer} = require("mongodb-memory-server");
const mongoose = require("mongoose");


async function createserver() {
    const server = await MongoMemoryServer.create();
    const serverURI = server.getUri();
    await mongoose.connect(serverURI, {dbName: "testingDB"});
    console.log("Mongo DB successfully started at " + serverURI);
}

module.exports = createserver;

