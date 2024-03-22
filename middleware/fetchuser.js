const jwt = require('jsonwebtoken');
const secretCode = "sign@Vineeth";

const fetchuser = (req, res, next) => {
    const token = req.header("authentication-token");

    // Check if token exists
    if (!token) {
        return res.status(401).send({ error: "Enter a valid token" });
    }

    try {
        // Verify the token
        const userData = jwt.verify(token, secretCode);
        // Set user data in request object
        req.user = userData.user;
        // Call next middleware
        next();
    } catch (error) {
        // Handle token verification errors
        console.error('Error verifying token:', error);
        res.status(401).send({ error: "Invalid token" });
    }
}

module.exports = fetchuser;
