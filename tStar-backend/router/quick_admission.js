const express =require("express");
const router =express.Router();
const db = require("../service/db.service");
const jwt = require("jsonwebtoken");





// router.post('/Quickadd', async (req, res) => {
//     const Student = req.body;

//     if (!Student.first_name || !Student.last_name || !Student.phone || !Student.email || !Student.password) {
//         return res.status(400).json({ ok: false, msg: "Incomplete data" });
//     }

//     try {
//         // Call the stored procedure with the correct syntax
//         const result = await db.executeProcedure(
//             "sp_Students_add",
//             [
//                 Student.admission_number,
//                 Student.first_name,
//                 Student.last_name,
//                 Student.email,
//                 Student.date_of_birth,
//                 Student.roll_number,
//                 Student.session_id,
//                 Student.course_id,
//                 Student.semester_id,
//                 Student.gender,
//                 Student.blood_group,
//                 Student.phone,
//                 Student.admission_date,
//                 Student.caste_category,
//                 Student.religion,
//                 Student.father_name,
//                 Student.mother_name,
//                 Student.father_phone,
//                 Student.mother_phone,
//                 Student.telephone,
//                 Student.password,
//                 Student.identification_mark || '',   // Additional 4 missing parameters
//                 Student.aadhar_number || '',
//                 Student.rte || '',
//                 Student.martial_status || ''
//             ]
//         );

//         if (!result[0]) {
//             return res.status(500).json({ ok: false, msg: "Error occurred while adding the student." });
//         }

//         res.json(result[0]);
//     } catch (error) {
//         console.error("Error executing procedure:", error);
//         res.status(500).json({ ok: false, msg: "An unexpected error occurred." });
//     }
// });

router.post('/Quickadd', async (req, res) => {
    const Student = req.body;

    // Validate required fields
    if (!Student.first_name || !Student.last_name || !Student.phone || !Student.email || !Student.password) {
        return res.status(400).json({ ok: false, msg: "Incomplete data" });
    }

    try {
        // Ensure integer values for IDs
        const course_id = parseInt(Student.course_id);
        const semester_id = parseInt(Student.semester_id);
        const session_id = parseInt(Student.session_id);

        if (isNaN(course_id) || isNaN(semester_id) || isNaN(session_id)) {
            return res.status(400).json({ ok: false, msg: "Invalid ID for course, semester, or session." });
        }

        // Call the stored procedure with all 25 parameters
        const result = await db.executeProcedure(
            "sp_Students_add",
            [
                Student.semester_id,             // 1
                Student.course_id,               // 2
                Student.session_id,              // 3
                Student.first_name,              // 4
                Student.last_name,               // 5
                Student.date_of_birth,           // 6
                Student.gender,                  // 7
                Student.phone,                   // 8
                Student.email,                   // 9
                Student.admission_number,        // 10
                Student.caste_category,          // 11
                Student.religion,                // 12
                Student.martial_status,          // 13
                Student.blood_group,             // 14
                Student.admission_date,          // 15
                Student.identification_mark,     // 16
                Student.aadhar_number,           // 17
                Student.telephone,               // 18
                Student.rte,                     // 19
                Student.father_name,             // 20
                Student.father_phone,            // 21
                Student.mother_name,             // 22
                Student.mother_phone,            // 23
                Student.password                 // 24
            ]
        );
        

        if (!result[0]) {
            return res.status(500).json({ ok: false, msg: "Error occurred while adding the student." });
        }

        res.json(result[0]);
    } catch (error) {
        console.error("Error executing procedure:", error);
        res.status(500).json({ ok: false, msg: "An unexpected error occurred." });
    }
});




router.post('/getall', async (req, res) => {
    try {
        let data = await db.executeProcedure("sp_Students_getall", []);
        res.json({ ok: true, data: data.flat() }); 
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ ok: false, msg: "Error fetching student: " + error.message });
    }
});


module.exports = router;


