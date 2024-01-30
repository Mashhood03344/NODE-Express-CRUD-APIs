const express = require('express');
const router = express.Router();
const pool = require('../pool');

// CRUD APIS for the table company_department //////////////////////////////////////

// GET API
router.get("/company_department", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM company_department');
        res.json(result.rows);
    } catch (err) {
        console.error(`Failed get request: ${err.message}`);
        res.status(500).json({ error: 'Internal Server error', message: err.message });
    }
});

// POST API for adding the departments in the company_deapartment table

// router.post('/Department/add', async (req, res) => {
//     try {
//         const { employee_name, department_names } = req.body;

//         // Checking if the provided employee_name exists in the employee table
//         const employeeResult = await pool.query('SELECT * FROM employee WHERE employee_name = $1', [employee_name]);

//         if (employeeResult.rows.length === 0) {
//             return res.status(404).json({ error: 'Employee not found' });
//         }

//         const company_id = employeeResult.rows[0].company_id;

//         // Retrieving department ids, by searching through department names in the department table
//         const department_ids = [];
//         for (const department_name of department_names) {
//             const departmentResult = await pool.query(
//                 'SELECT department_id FROM department WHERE department_name = $1',
//                 [department_name]
//             );

//             if (departmentResult.rows.length > 0) {
//                 department_ids.push(departmentResult.rows[0].department_id);
//             } else {
//                 // If department not found, you might want to handle this case
//                 console.error(`Department not found: ${department_name}`);
//             }
//         }

//         // Now, let's use the department_ids array to insert into the company_department table
//         const values = department_ids.map(department_id => [department_id, company_id]);

//         // Flatten the array of arrays to be used in the VALUES clause
//         const flattenedValues = values.reduce((acc, val) => acc.concat(val), []);

//         // Construct the dynamic part of the query
//         const placeholders = values.map((_, index) => `($${index * 2 + 1}, $${index * 2 + 2})`).join(', ');

//         // Construct the complete query string
//         const query = `INSERT INTO company_department (department_id, company_id) VALUES ${placeholders}`;

//         // Execute the query
//         await pool.query(query, flattenedValues);

//         res.status(200).json({ success: 'Departments added successfully' });
//     } catch (error) {
//         console.error('Error during POST request:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// json object 
// {
//     "employee_name": "Hanzla",
//     "department_names": ["Admin", "Marketing", "Sales"]
//   }

router.post('/Department/add', async (req, res) => {
    try {
        const { employee_email, department_names } = req.body;

        console.log(req.body);

        // Checking if the provided employee_email exists in the employee table
        const employeeResult = await pool.query('SELECT * FROM employee WHERE employee_email = $1', [employee_email]);

        if (employeeResult.rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        const company_id = employeeResult.rows[0].company_id;

        // Retrieving department ids by searching through department names in the department table
        const department_ids = [];
        for (const department_name of department_names) {
            const departmentResult = await pool.query(
                'SELECT department_id FROM department WHERE department_name = $1',
                [department_name]
            );

            if (departmentResult.rows.length > 0) {
                department_ids.push(departmentResult.rows[0].department_id);
            } else {
                // If department not found, you might want to handle this case
                console.error(`Department not found: ${department_name}`);
            }
        }

        // Now, let's use the department_ids array to insert into the company_department table
        const values = department_ids.map(department_id => [department_id, company_id]);

        // Flatten the array of arrays to be used in the VALUES clause
        const flattenedValues = values.reduce((acc, val) => acc.concat(val), []);

        // Construct the dynamic part of the query
        const placeholders = values.map((_, index) => `($${index * 2 + 1}, $${index * 2 + 2})`).join(', ');

        // Construct the complete query string
        const query = `INSERT INTO company_department (department_id, company_id) VALUES ${placeholders}`;

        // Execute the query
        await pool.query(query, flattenedValues);

        res.status(200).json({ success: 'Departments added successfully' });
    } catch (error) {
        console.error('Error during POST request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// {
//     "employee_email": "hamza@gmail.com",
//     "department_names": ["Admin", "Marketing", "Sales"]
//   }

// PUT API for updating the company_id for the company_department table 
router.put('/updateCompanyDepartment/Company/:id', async (req, res) => {
    try {
        const com_dep_id = parseInt(req.params.id);
        const { company_id } = req.body;

        // Validate the incoming data
        if (!company_id) {
            return res.status(400).json({ error: 'Company_id is required' });
        }

        // Check if the company_department with the given ID exists
        const existingCompanyDepartment = await pool.query(
            'SELECT * FROM company_department WHERE com_dep_id = $1',
            [com_dep_id]
        );

        if (existingCompanyDepartment.rows.length === 0) {
            return res.status(404).json({ error: 'Company Department not found' });
        }

        // Update the company_id in the database
        const updatedCompanyDepartment = await pool.query(
            'UPDATE company_department SET company_id = $1 WHERE com_dep_id = $2 RETURNING *',
            [company_id, com_dep_id]
        );

        res.status(200).json({ success: 'Company Department updated successfully', company_department: updatedCompanyDepartment.rows[0] });
    } catch (error) {
        console.error('Error during PUT request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// json object
// {
//     "company_id": "2"
// }


// PUT API for updating the department_id for the company_department table 

router.put('/updateCompanyDepartment/Department/:id', async (req, res) => {
    try {
        const com_dep_id = parseInt(req.params.id);
        const { department_id } = req.body;

        // Validate the incoming data
        if (!department_id) {
            return res.status(400).json({ error: 'Department_id is required' });
        }

        // Check if the company_department with the given ID exists
        const existingCompanyDepartment = await pool.query(
            'SELECT * FROM company_department WHERE com_dep_id = $1',
            [com_dep_id]
        );

        if (existingCompanyDepartment.rows.length === 0) {
            return res.status(404).json({ error: 'Company Department not found' });
        }

        // Update the department_id in the database
        const updatedCompanyDepartment = await pool.query(
            'UPDATE company_department SET department_id = $1 WHERE com_dep_id = $2 RETURNING *',
            [department_id, com_dep_id]
        );

        res.status(200).json({ success: 'Company Department updated successfully', company_department: updatedCompanyDepartment.rows[0] });
    } catch (error) {
        console.error('Error during PUT request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// json object 
// {
//     "department_id": "4"
// }


// DELETE API for the company_department table

router.delete('/deleteCompanyDepartment/:id', async (req, res) => {
    try {
        const com_dep_id = parseInt(req.params.id);

        // Check if the company_department with the given ID exists
        const existingCompanyDepartment = await pool.query(
            'SELECT * FROM company_department WHERE com_dep_id = $1',
            [com_dep_id]
        );

        if (existingCompanyDepartment.rows.length === 0) {
            return res.status(404).json({ error: 'Company Department not found' });
        }

        // Delete the company_department record from the database
        await pool.query(
            'DELETE FROM company_department WHERE com_dep_id = $1',
            [com_dep_id]
        );

        res.status(200).json({ success: 'Company and Department deleted successfully' });
    } catch (error) {
        console.error('Error during DELETE request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// endpoint for deletion: http://localhost:3000/api/deleteCompanyDepartment/1

module.exports = router;