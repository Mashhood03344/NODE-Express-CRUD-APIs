-- JS MINI PROJECT

-- query to show currently in-use DB
select current_database();

-- COMPANY table
DROP TABLE IF EXISTS company CASCADE;
CREATE TABLE IF NOT EXISTS company (
	company_id SERIAL PRIMARY KEY,
	company_name VARCHAR(50) NOT NULL,
	company_description TEXT NOT NULL
);

-- DEPARTMENT table
DROP TABLE IF EXISTS department CASCADE;
CREATE TABLE IF NOT EXISTS department (
	department_id SERIAL PRIMARY KEY,
	department_name VARCHAR(30) NOT NULL
);

-- following table will have foreign keys from both, company table and department table
-- following table will define many-to-many relationship
DROP TABLE IF EXISTS company_department CASCADE;
CREATE TABLE IF NOT EXISTS company_department (
	com_dep_id SERIAL PRIMARY KEY,
	company_id INT REFERENCES company ON DELETE CASCADE,
	department_id INT REFERENCES department ON DELETE CASCADE
);

-- EMPLOYEE table
DROP TABLE IF EXISTS employee CASCADE;
CREATE TABLE IF NOT EXISTS employee (
	employee_id SERIAL PRIMARY KEY,
	employee_name VARCHAR(60) NOT NULL,
	employee_email VARCHAR(100) NOT NULL,
	employee_password VARCHAR(8) NOT NULL,
	department_id INT REFERENCES department ON DELETE CASCADE,
	company_id INT REFERENCES company ON DELETE CASCADE
);

-- following query is to list down all the tables present in current database
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- ------------------------ INSERTION ---------------------------
INSERT INTO company (company_name, company_description) VALUES
('Programmers Force', 'A software company, proefficient with working in financial data!'),
('Arbisoft', 'A renowned software house, providing IT solutions locally and globally.'),
('Northbay Solutions', 'Service based software house, been in the industry for a long time')
;

INSERT INTO department (department_name) VALUES 
('Admin'),
('Marketing'),
('Sales'),
('Production'),
('Legal');

INSERT INTO employee (employee_name, employee_email,employee_password,department_id,company_id) VALUES
('Hanzla', 'hamza@gmail.com','12345678',1,1),
-- ('Ali', 3),
-- ('Umer', 3),
-- ('Omer', 5);

INSERT INTO company_department (company_id, department_id) VALUES (1,1);


UPDATE employee SET department_id = 2 WHERE employee_name = 'Hanzla';
UPDATE department SET department_name = 'Sales Yeah!' WHERE department_name = 'Sales';
DELETE FROM employee WHERE employee_id = 20;
TRUNCATE department CASCADE;

-- ------------------------ VISUALIZING ---------------------------
SELECT * FROM company c;
SELECT * FROM department d;
SELECT * FROM employee e;
SELECT * FROM company_department cd;
