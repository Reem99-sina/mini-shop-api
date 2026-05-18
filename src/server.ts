import dotenv from "dotenv";
dotenv.config();

import app from "./app";

const start = async () => {
  try {
    await app.listen({
      port: Number(process.env.PORT),
      host: "0.0.0.0",
    });

    console.log("Server running");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();