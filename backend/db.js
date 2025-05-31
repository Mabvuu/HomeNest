const mysql = require('mysql2');

// Load environment variables from .env file
require('dotenv').config();

// Create the connection pool
const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: process.env.MYSQL_CONNECTION_LIMIT || 10,
    queueLimit: 0,
});

// Export the connection
module.exports = db.promise();
