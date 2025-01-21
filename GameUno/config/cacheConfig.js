const { memoizationMiddleware, errorMiddleware } = require('../middleware/errorMiddleware');

const CacheConfig = {

  cacheSettings: async (req, res, next) => {
    try {
      const { max, maxAge } = req.body;
      const cacheConfig = {
        newMax: max, 
        newMaxAge: maxAge 
      };
      memoizationMiddleware(cacheConfig); 
      res.status(200).json({message: "cache configured successfully"});
    } catch (err) {
      next(err);
      
    }
  },


};

module.exports = CacheConfig;
