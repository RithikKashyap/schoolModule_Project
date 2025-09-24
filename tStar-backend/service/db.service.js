const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();


// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DEFAULT,
    waitForConnections: true,
    connectionLimit: 20, // Adjust based on your needs
    queueLimit: 0
});

/**
 * Get a connection from the pool
 * @returns {Promise<mysql.PoolConnection>}
 */
async function get_connection() {
    return await pool.getConnection();
}

/**
 * Executes a stored procedure with given parameters.
 * @param {string} procName - The name of the stored procedure.
 * @param {Array} params - The parameters to pass to the stored procedure.
 * @returns {Promise<any>} - The result set of the stored procedure.
 */
async function executeProcedure(procName, params) {
    let con;
    try {
        con = await get_connection();

        // Replace undefined parameters with null
        const sanitizedParams = params.map(param => param === undefined ? null : param);

        // Generate placeholders for query (e.g., ?, ?, ? for three params)
        const placeholders = sanitizedParams.map(() => '?').join(', ');

        // Execute the stored procedure
        const [results] = await con.execute(`CALL ${procName}(${placeholders})`, sanitizedParams);

        return results; // Return the entire result set
    } catch (error) {
        console.error("Error executing procedure:", error);
        throw new Error("Database error: " + error.message);
    } finally {
        if (con) con.release(); // Ensure the connection is released back to the pool
    }
}

module.exports = {
    get_connection,
    executeProcedure
};