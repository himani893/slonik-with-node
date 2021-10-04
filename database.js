/*const { createPool } = require("slonik");
const { config } = require("dotenv");

// import { config } from "dotenv";
config();

const client = process.env.DB_CLIENT;
const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const dbName = process.env.DB_NAME;

const clientConfiguration = {
    maximumPoolSize: process.env.POOL_SIZE,
    preferNativeBindings: true,
    captureStackTrace: false,
}

// pass db connection details to create a pool
const connection = createPool(`${client}://${username}:${password}@${host}:${port}/${dbName}`, clientConfiguration);
try {
    await connection.connect();
    console.log(pool.getPoolState());
    console.log("Database connected...");
} catch(error) {
    console.log(error);
    console.log("Database connection error...");
} finally {
    connection.end();
}
module.exports = connection;
*/