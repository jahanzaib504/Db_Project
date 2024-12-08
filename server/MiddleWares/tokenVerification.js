const jwt = require('jsonwebtoken')
const secretKey = '&*)043783&'
const  tokenMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Check if the Authorization header exists
    if (!authHeader) {
        return res.status(403).send('Authorization token is required');
    }

    // Extract the token (assuming the format "Bearer <token>")
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(403).send('Log in first');

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(401).send('Invalid token');
        req.user = decoded; // Attach decoded info to request
        next(); // Proceed to next middleware
    });
}
module.exports = {tokenMiddleware}