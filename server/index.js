const express = require('express');
const connection = require('./db'); // Ensure your database connection is properly set up
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const secretKey = '&*)043783&';
const cors=require('cors')
const app = express();
const {tokenMiddleware} = require('./MiddleWares/tokenVerification');
//MiddleWares
app.use(cors());
app.use(express.json({ limit: "200mb" })); // Adjust limit as needed
app.use(express.urlencoded({ limit: "200mb", extended: true }));
app.use((req, res, next) => {
    console.log(`Content-Length: ${req.headers["content-length"] || 0} bytes`);
    next();
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.use('/auth', require('./Routes/auth'))
app.use(tokenMiddleware);

app.use('/user', require('./Routes/user'))
app.use('/post', require('./Routes/post'));
app.use('/comment', require('./Routes/comment'))
app.use('/reply', require('./Routes/reply'))
app.use('/friend', require('./Routes/friend'));
// Apply the middleware globally

