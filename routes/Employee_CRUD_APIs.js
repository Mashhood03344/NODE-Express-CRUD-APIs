const express = require('express');
const router = express.Router();
const pool = require('../pool');

// CRUD APIS for the table employee //////////////////////////////////////

router.get("/employees", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM employee');
        res.json(result.rows);
    } catch (err) {
        console.error(`Failed get request: ${err.message}`);
        res.status(500).json({ error: 'Internal Server error', message: err.message });
    }
});

// POST API for the employee

router.post('/employee', async (req, res) => {
    try {
        const { employee_name, employee_email, employee_password, department_name, company_name } = req.body;

        // Check if the email is already in the database
        const existingEmployee = await pool.query("SELECT * FROM employee WHERE employee_email = $1", [employee_email]);

        if (existingEmployee.rows.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Retrieve department_id
        const departmentResult = await pool.query("SELECT department_id FROM department WHERE department_name = $1", [department_name]);

        if (departmentResult.rows.length === 0) {
            return res.status(404).json({ error: 'Department not found' });
        }

        const department_id = departmentResult.rows[0].department_id;

        // Retrieve company_id
        const companyResult = await pool.query("SELECT company_id FROM company WHERE company_name = $1", [company_name]);

        if (companyResult.rows.length === 0) {
            return res.status(404).json({ error: 'Company not found' });
        }

        const company_id = companyResult.rows[0].company_id;

        // Insert into the employee table
        const insertEmployeeResult = await pool.query(
            'INSERT INTO employee (employee_name, employee_email, employee_password, department_id, company_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [employee_name, employee_email, employee_password, department_id, company_id]
        );

        const newEmployee = insertEmployeeResult.rows[0];

        res.status(201).json({ success: 'Employee added successfully', employee: newEmployee });
    } catch (error) {
        console.error('Employee Insertion Unsuccessful', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// JSON object

// {
//     "employee_name": "Waqaar",
//     "employee_email":"waqaar@gmail.com",
//     "employee_password": "67541234",
//     "department_name": "Marketing",
//     "company_name": "Arbisoft"
// }

// Update API for the email of the employee 

router.put('/employee/email/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { employee_email } = req.body;

    pool.query("SELECT * FROM employee WHERE employee_id = $1", [id], (error, results) => {
        console.log(results.rows);
        const noEmployeeFound = !results.rows.length;
        if (noEmployeeFound) {
            res.send(`Employee does not exist, could not update the employee`);
        } else {
            pool.query("UPDATE employee SET employee_email = $1 WHERE employee_id = $2", [employee_email, id], (error, results) => {
                if (error) {
                    console.log("Error updating employee email:", error);
                    res.status(500).send("Internal Server Error");
                } else {
                    res.status(200).send(`Employee email updated successfully`);
                }
            });
        }
    });
});

// json object
// {
//     employee_email: "hanzla@gmail.com"
// }

router.put('/employee/password/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { employee_password } = req.body;

    pool.query("SELECT * FROM employee WHERE employee_id = $1", [id], (error, results) => {
        console.log(results.rows);
        const noEmployeeFound = !results.rows.length;
        if (noEmployeeFound) {
            res.send(`Employee does not exist, could not update the employee`);
        } else {
            pool.query("UPDATE employee SET employee_password = $1 WHERE employee_id = $2", [employee_password, id], (error, results) => {
                if (error) {
                    console.log("Error updating employee email:", error);
                    res.status(500).send("Internal Server Error");
                } else {
                    res.status(200).send(`Employee updated successfully`);
                }
            });
        }
    });
});

//json object 

// {
//     employee_password: 12343213
// }

// DELETE API for the employee table 

router.delete('/deleteEmployee/:id', async (req, res) => {
    try {
        const employee_id = parseInt(req.params.id);

        // Check if the employee with the given ID exists
        const existingEmployee = await pool.query('SELECT * FROM employee WHERE employee_id = $1', [employee_id]);

        if (existingEmployee.rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        // Delete the employee from the database
        await pool.query('DELETE FROM employee WHERE employee_id = $1', [employee_id]);

        res.status(200).json({ success: 'Employee deleted successfully' });
    } catch (error) {
        console.error('Error during DELETE request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// endpoint for deleteion: http://localhost:3000/api/deleteEmployee/1

module.exports = router;