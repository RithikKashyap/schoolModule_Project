const express=require("express");
const router=express.Router();
const db=require("../service/db.service");

router.post('/add', async (req, res) => {
    const ut = req.body;

    // Validate the incoming data
    if (
        // !ut.user_subtype_id ||
         !ut.user_type_name ) {
        return res.json({ ok: false, msg: "Incomplete data" }); // Early return for missing required fields
    }

    try {
        // Call the stored procedure to add the user
        const result = await db.executeProcedure('sp_user_type_add', [
            // ut.user_subtype_id,
            ut.user_type_name
           
        ]);

        // Check if the result indicates an error or unsuccessful addition
        if (!result) {
            return res.json({ ok: false, msg: "Error occurred while adding the user_type." });
        }

        // Return the response from the stored procedure
        res.json({ ok: true, msg: "user_type added successfully", data: result });

    } catch (error) {
        console.error("Error executing procedure:", error);
        res.json({ ok: false, msg: "Database error: " + error.message });
    }
});


router.post('/getall', async (req, res) => {
    try {
        let data = await db.executeProcedure("sp_user_type_getall", []);
        res.json({ ok: true, data: data.flat() }); // Flatten in case of multiple result sets
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ ok: false, msg: "Error fetching user_type: " + error.message });
    }
});

module.exports=router