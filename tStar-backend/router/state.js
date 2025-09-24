const express=require("express");
const router=express.Router();
const db = require("../service/db.service");

router.post('/Zadd', async (req, res) => {
    const state = req.body;

    // Validate the incoming data
    if (!state.country_id || !state.state_name) {
        return res.json({ ok: false, msg: "Incomplete data" }); // Early return for missing required fields
    }

    try {
        // Call the stored procedure to add the user
        const result = await db.executeProcedure('sp_state_add', [
            state.country_id,
            state.state_name
           
        ]);

        // Check if the result indicates an error or unsuccessful addition
        if (!result) {
            return res.json({ ok: false, msg: "Error occurred while adding the state." });
        }

        // Return the response from the stored procedure
        res.json({ ok: true, msg: "state added successfully", data: result });

    } catch (error) {
        console.error("Error executing procedure:", error);
        res.json({ ok: false, msg: "Database error: " + error.message });
    }
});


router.post('/getall', async (req, res) => {
    try {
        let data = await db.executeProcedure("sp_state_getall", []);
        res.json({ ok: true, data: data.flat() }); // Flatten in case of multiple result sets
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ ok: false, msg: "Error fetching state: " + error.message });
    }
});

// ✅ New Route: Get states by country ID
router.post("/sp_state_get_by_country_id/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const result = await db.executeProcedure("sp_state_get_by_country_id", [id]); 
        res.json(result);
    } catch (error) {
        console.error("❌ Error fetching states:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports=router