const express = require('express');
const router = express.Router();
const { executeProcedure } = require("../service/db.service"); 


router.post("/add", async (req, res) => {
    const { pincode,country_id, state_id, city_id,locality_name,area_name } = req.body;

    // Validate the incoming data
    if ( !pincode || !state_id || !city_id || !country_id || !locality_name|| !area_name) {
        return res.status(400).json({ ok: false, msg: "pincode, state ID and city id are required." });
    }

    try {
        const result = await db.executeProcedure("sp_pincode_add", [country_id, state_id, city_id, pincode, locality_name, area_name]);

        if (!result || result.affectedRows === 0) {
            return res.status(500).json({ ok: false, msg: "Failed to add the pincode." });
        }

        res.status(201).json({ ok: true, msg: "pincode added successfully.", data: result });
    } catch (error) {
        console.error("❌ Error adding pincode:", error.message);
        res.status(500).json({ ok: false, msg: "Database error: " + error.message });
    }
});



// Endpoint to fetch data by pincode
router.post('/fetch', async (req, res) => {
    const { pincode } = req.body;
  
    console.log("Received pincode:", pincode);  // Debugging log
  
    if (!pincode) {
      return res.json({ ok: false, msg: "Pincode is required" });
    }
  
    try {
      // Check the result of the procedure call
      const result = await executeProcedure('sp_get_data', [pincode]);
      console.log("Procedure result:", result);  // Debugging log
  
      if (!result || result.length === 0) {
        return res.json({ ok: false, msg: "No data found for the given pincode" });
      }
  
      res.json({ ok: true, msg: "Data fetched successfully", data: result });
  
    } catch (error) {
      console.error("Error executing procedure:", error);
      res.json({ ok: false, msg: "Database error: " + error.message });
    }
  });


  
  // Endpoint to get all pincode data
  router.post('/getall', async (req, res) => {
    try {
      const result = await executeProcedure('sp_pincode_getall');
  
      if (!result || result.length === 0) {
        return res.json({ ok: false, msg: "No data available" });
      }
  
      res.json({ ok: true, msg: "All data fetched successfully", data: result });
  
    } catch (error) {
      console.error("Error executing procedure:", error);
      res.json({ ok: false, msg: "Database error: " + error.message });
    }
  });

  
  
  module.exports = router;