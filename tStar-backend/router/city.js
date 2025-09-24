const express = require("express");
const router = express.Router();
const db = require("../service/db.service");

/**
 * Add a new city
 */
router.post("/addA", async (req, res) => {
    const { state_id, city_name } = req.body;

    // Validate the incoming data
    if (!state_id || !city_name) {
        return res.status(400).json({ ok: false, msg: "State ID and city name are required." });
    }

    try {
        const result = await db.executeProcedure("sp_city_add", [state_id, city_name]);

        if (!result || result.affectedRows === 0) {
            return res.status(500).json({ ok: false, msg: "Failed to add the city." });
        }

        res.status(201).json({ ok: true, msg: "City added successfully.", data: result });
    } catch (error) {
        console.error("❌ Error adding city:", error.message);
        res.status(500).json({ ok: false, msg: "Database error: " + error.message });
    }
});

/**
 * Get all cities
 */
router.post("/getall", async (req, res) => {
    try {
        const result = await db.executeProcedure("sp_city_getall", []);

        const cities = Array.isArray(result) ? result.flat() : [];
        res.status(200).json({ ok: true, data: cities });
    } catch (error) {
        console.error("❌ Error fetching cities:", error.message);
        res.status(500).json({ ok: false, msg: "Error fetching cities: " + error.message });
    }
});

/**
 * Get cities by state ID
 */
router.post("/get_by_state/:id", async (req, res) => {
    const stateId = req.params.id;

    if (!stateId) {
        return res.status(400).json({ ok: false, msg: "State ID is required." });
    }

    try {
        const result = await db.executeProcedure("sp_city_get_by_state_id", [stateId]);

        if (!result || result.length === 0) {
            return res.status(404).json({ ok: false, msg: "No cities found for this state ID." });
        }

        res.status(200).json({ ok: true, data: result });
    } catch (error) {
        console.error("❌ Error fetching cities by state ID:", error.message);
        res.status(500).json({ ok: false, msg: "Error fetching cities: " + error.message });
    }
});

module.exports = router;
