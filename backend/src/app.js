import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import conferenciaRoutes from "./routes/conferencia.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

// 🔒 Segurança básica
app.use(helmet());

// 🌎 CORS
app.use(cors());

// 📦 Parser JSON
app.use(express.json({ limit: "10mb" }));

// 🚦 Rate limit global
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // 100 requisições por IP
    message: "Muitas requisições. Tente novamente mais tarde."
  })
);

// 🏥 Rota de health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// 📌 Rotas principais
app.use("/api/conferencia", conferenciaRoutes);

// ❌ Middleware global de erro
app.use(errorMiddleware);

export default app;