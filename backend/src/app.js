import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import conferenciaRoutes from "./routes/conferencia.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

const configuredOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (process.env.NODE_ENV !== "production") {
  configuredOrigins.push("http://localhost:5173", "http://localhost:3000");
}

const allowedOrigins = [...new Set(configuredOrigins)];
const isProduction = process.env.NODE_ENV === "production";

app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      if (!isProduction) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.length === 0) {
        callback(new Error("CORS nao configurado no servidor."));
        return;
      }

      callback(new Error("Origem nao permitida pelo CORS."));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Muitas requisicoes. Tente novamente mais tarde.",
  })
);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/conferencia", conferenciaRoutes);
app.use(errorMiddleware);

export default app;
