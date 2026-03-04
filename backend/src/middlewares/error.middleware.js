export default function errorMiddleware(err, req, res, next) {
  console.error("Erro:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Erro interno do servidor"
  });
}