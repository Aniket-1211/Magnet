import express from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env.js";
import { router } from "./routes/index.js";
import { notFoundMiddleware } from "./middleware/notFound.middleware.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

export const app = express();

const devOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (origin === env.CLIENT_ORIGIN) {
        callback(null, true);
        return;
      }

      if (env.NODE_ENV === "development" && devOriginPattern.test(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  })
);
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1", router);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
