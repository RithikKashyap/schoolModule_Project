const express=require("express");
const router=express.Router();
const db=require("../service/db.service");

router.post('/add', async (req, res) => {
    const ust = req.body;

    // Validate the incoming data
    if (!ust.user_type_id || !ust.user_subtype_name) {
        return res.json({ ok: false, msg: "Incomplete data" }); // Early return for missing required fields
    }

    try {
        // Call the stored procedure to add the user
        const result = await db.executeProcedure('sp_user_subtype_add', [
            ust.user_type_id,
            ust.user_subtype_name

        ]);

        // Check if the result indicates an error or unsuccessful addition
        if (!result) {
            return res.json({ ok: false, msg: "Error occurred while adding the user_subtype." });
        }

        // Return the response from the stored procedure
        res.json({ ok: true, msg: "user_subtype added successfully", data: result });

    } catch (error) {
        console.error("Error executing procedure:", error);
        res.json({ ok: false, msg: "Database error: " + error.message });
    }
});

router.post('/getall', async (req, res) => {
    try {
        let data = await db.executeProcedure("sp_user_subtype_getall", []);
        res.json({ ok: true, data: data.flat() }); // Flatten in case of multiple result sets
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ ok: false, msg: "Error fetching user_subtype: " + error.message });
    }
});

// ✅ New Route: Get user_subtype by user_type id
router.post('/get_by_user_type_id/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Validate the id parameter
        if (!id || isNaN(id)) {
            return res.status(400).json({ ok: false, msg: "Invalid or missing user_type_id" });
        }

        const result = await db.executeProcedure("sp_user_subtype_get_by_user_type_id", [id]); // ✅ Use db.executeProcedure
        res.json({ ok: true, data: result });
    } catch (error) {
        console.error("❌ Error fetching user_subtype by user_type id:", error);
        res.status(500).json({ ok: false, msg: "Internal Server Error: " + error.message });
    }
});

module.exports=router