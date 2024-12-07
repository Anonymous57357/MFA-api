// /middlewares/authMiddleware.js

const authMiddleware = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next(); // Proceed to the next middleware/route handler
    }
  
    // If not authenticated, send a 401 Unauthorized response
    res.status(401).json({ message: "Unauthorized" });
  };
  
  export default authMiddleware;
  