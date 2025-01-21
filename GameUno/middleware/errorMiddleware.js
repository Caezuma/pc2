function memoizationMiddleware(config) {
  const cache = new Map(); 
  const max = config.max || 50; 
  const maxAge = config.maxAge || 30000;

  return (req, res, next) => {
    const cacheKey = `${req.method}:${req.originalUrl}`; 

    if (cache.has(cacheKey)) {
      const cachedData = cache.get(cacheKey);
      const isExpired = Date.now() - cachedData.timestamp > maxAge; 

      if (!isExpired) {
        cache.delete(cacheKey); // Remove e re-adiciona a entrada para manter a ordem de LRU.
        cache.set(cacheKey, { ...cachedData, timestamp: Date.now() });
        return res.json(cachedData.response); 
      }

      cache.delete(cacheKey); // Remove a entrada expirada do cache.
    }

    const originalSend = res.send.bind(res);
    res.send = (body) => {
      if (res.statusCode === 200) {
        if (cache.size >= max) {
          const oldestKey = cache.keys().next().value; 
          cache.delete(oldestKey); // Remove a entrada mais antiga para abrir espaço.
        }

        cache.set(cacheKey, { response: body, timestamp: Date.now() });
      }
      return originalSend(body);
    };
    next();
  };
}


function errorMiddleware(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Erro middleware: Erro de análise JSON', err);
    return res.status(400).json({ error: 'Erro de análise JSON' });
  }

  console.error('Erro middleware:', err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
}

module.exports = { memoizationMiddleware, errorMiddleware };
