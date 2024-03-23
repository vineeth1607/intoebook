const jwt = require('jsonwebtoken');
const secretCode = "sign@Vineeth";

const fetchuser = (req, res, next) => {
    const token = req.header("authentication-token");

    // Check if token exists
    if (!token) {
        return res.status(401).send({ error: "Token is missing" });
    }

    try {
        // Verify the token
        const userData = jwt.verify(token, secretCode);
        
        // Set user data in request object
        req.user = userData.user;
        
        // Call next middleware
        next();
    } catch (error) {
        // Log token verification errors
        console.error('Error verifying token:', error);
        
        // If token is invalid or expired
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send({ error: "Token has expired" });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).send({ error: "Invalid token" });
        } else {
            return res.status(500).send({ error: "Internal server error" });
        }
    }
}

module.exports = fetchuser;

