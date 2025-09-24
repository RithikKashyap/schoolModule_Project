const express=require("express");
const router=express.Router();
const db = require("../service/db.service");

// router.post("./add",
//     async(req,res)=>{
//         let con=await db();
//         let data=await con.execute("sp_country_add()",[])

//         res.json(data[0][0])
//     }
// )


router.post('/Yadd', async (req, res) => {
    const country = req.body;

    // Validate the incoming data
    if (!country.country_name ) {
        return res.json({ ok: false, msg: "Incomplete data" }); // Early return for missing required fields
    }

    try {
        // Call the stored procedure to add the user
        const result = await db.executeProcedure('sp_country_add', [
            country.country_name
           
        ]);

        // Check if the result indicates an error or unsuccessful addition
        if (!result) {
            return res.json({ ok: false, msg: "Error occurred while adding the country." });
        }

        // Return the response from the stored procedure
        res.json({ ok: true, msg: "country added successfully", data: result });

    } catch (error) {
        console.error("Error executing procedure:", error);
        res.json({ ok: false, msg: "Database error: " + error.message });
    }
});



router.post('/getall', async (req, res) => {
    try {
        let data = await db.executeProcedure("sp_country_getall", []);
        res.json({ ok: true, data: data.flat() }); 
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ ok: false, msg: "Error fetching country: " + error.message });
    }
});


module.exports=router