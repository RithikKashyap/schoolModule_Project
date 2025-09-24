const express =require("express");
const router =express.Router();
const db = require("../service/db.service");
const jwt = require("jsonwebtoken");



// Add a new user
router.post('/Aadd', async (req, res) => {
    const Student = req.body;

    // Validate the incoming data
    if (!Student.first_name || !Student.last_name || !Student.phone || !Student.email || !Student.password) {
        return res.status(400).json({ ok: false, msg: "Incomplete data" }); // Use appropriate status code
    }

    try {
        const result = await db.executeProcedure(
            "sp_Students_add",
            [
          
                Student.semester_id,
                Student.course_id,
                Student.session_id,
                Student.first_name,
                Student.last_name,
                Student.date_of_birth,
                Student.gender,
                Student.phone,
                Student.email,
                Student.roll_number,
                Student.admission_number,
                Student.caste_category,
                Student.religion,
                Student.martial_status,
                Student.blood_group,
                Student.admission_date,
                Student.identification_mark,
                Student.aadhar_number,
                Student.telephone,
                Student.rte,
                Student.password,
                Student.father_name,
                Student.father_phone,
                Student.mother_name,
                Student.mother_phone
            ]
        );

        // Check for errors in the result
        if (!result[0]) {
            return res.status(500).json({ ok: false, msg: "Error occurred while adding the user." });
        }

        // Return the response from the stored procedure
        res.json(result[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: "An unexpected error occurred." });
    }
});

router.post('/getall', async (req, res) => {
    try {
        let data = await db.executeProcedure("sp_Students_getall", []);
        res.json({ ok: true, data: data.flat() }); 
    } catch (error) {
        console.error("Error fetching student:", error);
        res.status(500).json({ ok: false, msg: "Error fetching student: " + error.message });
    }
});


// Authenticate user
router.post('/authenticate', async (req, res) => {
    const u = req.body;

    // Validate input
    if (!u.first_name || !u.last_name || !u.phone || !u.email) {
        return res.status(400).send({ ok: false, msg: "Email  are required." });
    }

    try {
        // Get a database connection
        // let con = await db();

        // Call the stored procedure for authentication
        let data = await db.executeProcedure("CALL sp_Students_authenticate(?,?)", [
            u.admission_number,
            u.email
        ]);

        // Extract the first row from the result
        data = data[0][0][0][0];

        if (data.ok) {
            // Generate a JWT token
            const token = jwt.sign(data.data, process.env.TOKEN_SECRET, { expiresIn: '2h' });
            data.token = token;
        }

        // Respond with the data
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: "An unexpected error occurred." });
    }


});

module.exports = router;


