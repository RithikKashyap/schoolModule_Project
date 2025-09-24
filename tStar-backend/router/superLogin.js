const express = require("express");
const router = express.Router();
const db = require("../service/db.service");
const jwt = require("jsonwebtoken");

// Add a new user
router.post('/Xadd', async (req, res) => {
    const user = req.body;

    // Validate the incoming data
    if (!user.name || !user.email || !user.password  ) {
        return res.status(400).json({ ok: false, msg: "All fields are required to add a new user." }); // Updated message for clarity
    }

    try {
        const result = await db.executeProcedure(
            "sp_user_add",
            [
                user.name,               
                user.email,
                user.password,               
            ]
        );

        // Check for errors in the result
        if (!Array.isArray(result) || result.length === 0 || !result[0] || !result[0][0]) {
            return res.status(500).json({ ok: false, msg: "Failed to add the user. Please try again later." }); // Updated message for better user understanding
        }

        // Return the response from the stored procedure
        res.json({ ok: true, data: result[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: "An unexpected error occurred while adding the user." }); // Updated message for better context
    }
});

router.post('/getall', async (req, res) => {
    try {
        let data = await db.executeProcedure("sp_user_getall", []);
        res.json({ ok: true, data: data.flat() });
    } catch (error) {
        console.error("Error fetching student:", error);
        res.status(500).json({ ok: false, msg: "Error fetching student: " + error.message });
    }
});
router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ ok: false, msg: "Email and password are required." });
    }

    try {
        const result = await db.executeProcedure("sp_user_authenticate", [email, password]);

        // Handle unexpected responses
        if (!Array.isArray(result) || result.length === 0 || !result[0]) {
            return res.status(500).json({ ok: false, msg: "Unexpected error during authentication." });
        }

        const response = result[0][0]; // First row of the first result set

        if (response.ok === 1) {
            // You can sign a JWT here if needed
            const token = jwt.sign({ email: email }, "your_jwt_secret", { expiresIn: "1h" });

            // If data is already an object, no need to JSON.parse it
            let data = response.data;

            // If data is a string, you parse it into JSON
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }

            return res.json({
                ok: true,
                msg: response.msg,
                token: token,
                data: data // Returning parsed data
            });
        } else {
            return res.status(401).json({ ok: false, msg: response.msg });
        }
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(500).json({ ok: false, msg: "Server error during authentication." });
    }
});


module.exports = router;


