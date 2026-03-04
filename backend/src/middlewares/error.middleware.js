function traduzirErro(err) {
  if (!err) {
    return {
      status: 500,
      message: "Erro interno do servidor."
    };
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    return {
      status: 400,
      message: "Arquivo muito grande. Envie arquivos de ate 30MB."
    };
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return {
      status: 400,
      message: "Campo de arquivo invalido. Envie os arquivos nos campos corretos."
    };
  }

  if (err.message === "File too large") {
    return {
      status: 400,
      message: "Arquivo muito grande. Envie arquivos de ate 30MB."
    };
  }

  if (err.message === "Unexpected field") {
    return {
      status: 400,
      message: "Campo de arquivo inesperado. Verifique o envio do Excel e PDF."
    };
  }

  if (err.message === "CORS nao configurado no servidor.") {
    return {
      status: 500,
      message: "Servidor sem configuracao de acesso entre frontend e backend. Contate o suporte."
    };
  }

  if (err.message === "Origem nao permitida pelo CORS.") {
    return {
      status: 403,
      message: "Acesso bloqueado por seguranca do servidor (CORS)."
    };
  }

  return {
    status: err.status || 500,
    message: err.message || "Erro interno do servidor."
  };
}

export default function errorMiddleware(err, req, res, next) {
  console.error("Erro:", err);

  const erroTraduzido = traduzirErro(err);

  res.status(erroTraduzido.status).json({
    success: false,
    message: erroTraduzido.message
  });
}
