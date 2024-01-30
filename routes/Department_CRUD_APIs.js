const express = require('express');
const router = express.Router();
const pool = require('../pool');


// CRUD APIS for the table department //////////////////////////////////////

router.get("/departments", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM department');
        res.json(result.rows);
    } catch (err) {
        console.error(`Failed get request: ${err.message}`);
        res.status(500).json({ error: 'Internal Server error', message: err.message });
    }
});

// POST request for the department table

router.post('/addDepartment', async (req, res) => {
    try {
        const { department_name } = req.body;

        // Validate the incoming data
        if (!department_name) {
            return res.status(400).json({ error: 'Department name is required' });
        }

        // Check if the department with the given name already exists
        const existingDepartment = await pool.query('SELECT * FROM department WHERE department_name = $1', [department_name]);

        if (existingDepartment.rows.length > 0) {
            return res.status(400).json({ error: 'Department already exists' });
        }

        // Insert the new department into the database
        const newDepartment = await pool.query(
            'INSERT INTO department (department_name) VALUES ($1) RETURNING *',
            [department_name]
        );

        res.status(201).json({ success: 'Department added successfully', department: newDepartment.rows[0] });
    } catch (error) {
        console.error('Error during POST request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//json object
// {
//     "department_name": "new department"
// }


// PUT API for the department_name in the department table 

router.put('/updateDepartment/:id', async (req, res) => {
    try {
        const department_id = parseInt(req.params.id);
        const { department_name } = req.body;

        // Validate the incoming data
        if (!department_name) {
            return res.status(400).json({ error: 'Department name is required' });
        }

        // Check if the department with the given ID exists
        const existingDepartment = await pool.query('SELECT * FROM department WHERE department_id = $1', [department_id]);

        if (existingDepartment.rows.length === 0) {
            return res.status(404).json({ error: 'Department not found' });
        }

        // Update the department name in the database
        const updatedDepartment = await pool.query(
            'UPDATE department SET department_name = $1 WHERE department_id = $2 RETURNING *',
            [department_name, department_id]
        );

        res.status(200).json({ success: 'Department name updated successfully', department: updatedDepartment.rows[0] });
    } catch (error) {
        console.error('Error during PUT request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// json object 

// {
//     "department_name": "update department"
// }

// DELETE API for the department table

router.delete('/deleteDepartment/:id', async (req, res) => {
    try {
        const department_id = parseInt(req.params.id);

        // Check if the department with the given ID exists
        const existingDepartment = await pool.query('SELECT * FROM department WHERE department_id = $1', [department_id]);

        if (existingDepartment.rows.length === 0) {
            return res.status(404).json({ error: 'Department not found' });
        }

        // Delete the department from the database
        await pool.query('DELETE FROM department WHERE department_id = $1', [department_id]);

        res.status(200).json({ success: 'Department deleted successfully' });
    } catch (error) {
        console.error('Error during DELETE request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// endpoint for deletion: http://localhost:3000/api/deleteDepartment/6

module.exports = router;