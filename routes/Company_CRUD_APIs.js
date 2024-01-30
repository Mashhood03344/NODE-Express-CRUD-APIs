const express = require('express');
const router = express.Router();
const pool = require('../pool');

// GET company by ID
router.get('/company/:id', async (req, res) => {
    try {
        const companyId = parseInt(req.params.id);
        const result = await pool.query('SELECT * FROM company WHERE company_id = $1', [companyId]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Company not found' });
        } else {
            res.json(result.rows[0]);
        }
    } catch (err) {
        console.error(`Failed get request: ${err.message}`);
        res.status(500).json({ error: 'Internal Server error', message: err.message });
    }
});

// CRUD APIS for the company table //////////////////////////////////////

// GET API for the company table
router.get("/companies", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM company');
        res.json(result.rows);
    } catch (err) {
        console.error(`Failed get request: ${err.message}`);
        res.status(500).json({ error: 'Internal Server error', message: err.message });
    }
});

// POST API for company registration
router.post('/registerCompany', async (req, res) => {
    try {
        // Validate the incoming JSON data
        const { company_name, company_description, employee_name, employee_email, employee_password } = req.body;

        // Check if required fields are missing in the data
        if (!company_name || !company_description || !employee_name || !employee_email || !employee_password) {
            return res.status(400).json({ error: 'Missing required fields in the data' });
        }

        // Check if the company name already exists in the database
        const existingCompany = await pool.query("SELECT * FROM company WHERE company_name = $1", [company_name]);

        if (existingCompany.rows.length > 0) {
            return res.status(400).json({ error: 'Company already exists' });
        }

        // Insert data into the company table
        const insertCompanyResult = await pool.query("INSERT INTO company (company_name, company_description) VALUES ($1, $2) RETURNING company_id", [company_name, company_description]);

        // Retrieve the company_id after insertion
        const company_id = insertCompanyResult.rows[0].company_id;

        // Insert data into the employee table
        await pool.query("INSERT INTO employee (employee_name, employee_email, employee_password, department_id, company_id) VALUES ($1, $2, $3, $4, $5)", [employee_name, employee_email, employee_password, 1, company_id]);

        res.status(201).json({ success: 'Company and employee added successfully', company_id });
    } catch (error) {
        console.error('Error during POST request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// json object 

// {
//     "company_name": "Devsinc",
//     "company_description": "We integrate global leaders in web development with passionate Asian talent to get a unique blend of Quality and Affordability.",
//     "employee_name": "Raja Hassan",
//     "employee_email": "raja@gmail.com",
//     "employee_password": "12341234"
// }

// UPDATE API that updates the company name in the company table 

router.put('/updateCompanyName/:id', async (req, res) => {
    try {
        const company_id = parseInt(req.params.id);
        const { company_name } = req.body;

        // Validate the incoming data
        if (!company_name) {
            return res.status(400).json({ error: 'Company name is required' });
        }

        // Check if the company with the given ID exists
        const existingCompany = await pool.query('SELECT * FROM company WHERE company_id = $1', [company_id]);

        if (existingCompany.rows.length === 0) {
            return res.status(404).json({ error: 'Company not found' });
        }

        // Update the company name in the database
        const updatedCompany = await pool.query(
            'UPDATE company SET company_name = $1 WHERE company_id = $2 RETURNING *',
            [company_name, company_id]
        );

        res.status(200).json({ success: 'Company name updated successfully', company: updatedCompany.rows[0] });
    } catch (error) {
        console.error('Error during PUT request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// json object

// {
//     "company_name": "ABC"
// }

// UPDATE API that updates the company description in the company table

router.put('/updateCompanyDescription/:id', async (req, res) => {
    try {
        const companyId = parseInt(req.params.id);
        const { company_description } = req.body;

        // Validate the incoming data
        if (!company_description) {
            return res.status(400).json({ error: 'Company description is required' });
        }

        // Check if the company with the given ID exists
        const existingCompany = await pool.query('SELECT * FROM company WHERE company_id = $1', [companyId]);

        if (existingCompany.rows.length === 0) {
            return res.status(404).json({ error: 'Company not found' });
        }

        // Update the company description in the database
        const updatedCompany = await pool.query(
            'UPDATE company SET company_description = $1 WHERE company_id = $2 RETURNING *',
            [company_description, companyId]
        );

        res.status(200).json({ success: 'Company description updated successfully', company: updatedCompany.rows[0] });
    } catch (error) {
        console.error('Error during PUT request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// json object

// {
//     "company_description": "A software company, proefficient with working in financial data!"
// }

// DELETE API for the company table

router.delete('/deleteCompany/:id', async (req, res) => {
    try {
        const company_id = parseInt(req.params.id);

        // Check if the company with the given ID exists
        const existingCompany = await pool.query('SELECT * FROM company WHERE company_id = $1', [company_id]);

        if (existingCompany.rows.length === 0) {
            return res.status(404).json({ error: 'Company not found' });
        }

        // Delete the company from the database
        await pool.query('DELETE FROM company WHERE company_id = $1', [company_id]);

        res.status(200).json({ success: 'Company deleted successfully' });
    } catch (error) {
        console.error('Error during DELETE request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// endpoint for deletion: http://localhost:3000/api/deleteCompany/1

module.exports = router;