export function verifyToken(token, callback) {
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return callback(err, null);
        }
        return callback(null, decoded);
    });
}