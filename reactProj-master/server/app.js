const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


const connection = mysql.createConnection({
    user: 'root',
    password:']xx;vGU@A$x;aUu|', // e.g. 'my-db-password'
    database: 'job_portal', // e.g. 'my-database'
    // socketPath:'/cloudsql/job-portal-394115:us-central1:job-portal', // e.g. '/cloudsql/project:region:instance'
    host:'34.31.61.56'
    // host:'job-portal'
  });

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

connection.connect((error) => {
    if (error) {
        console.error('Error connecting to database:', error);
    } else {
        console.log('Connected to database!');
    }
});


// Route to handle login requests
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    connection.query(
        'SELECT id, email, role FROM users WHERE email = ? AND password = ?',
        [email, password],
        (error, results) => {
            if (error) {
                console.error('Error querying database:', error);
                res.status(500).json({ error: 'An error occurred while processing your request.' });
            } else {
                if (results.length > 0) {
                    const userRole = results[0].role;
                    res.status(200).json({ userRole });
                } else {
                    res.status(401).json({ error: 'Invalid email or password. Please try again.' });
                }
            }
        }
    );
});


// Route to handle signup requests
app.post('/api/signup', (req, res) => {
    const { firstName, lastName, email, role, password } = req.body;

    // Check if the required fields are present
    if (!firstName || !lastName || !email || !role || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    // Insert the user data into the database
    connection.query(
        'INSERT INTO users (firstName, lastName, email, role, password) VALUES (?, ?, ?, ?, ?)',
        [firstName, lastName, email, role, password],
        (error, results) => {
            if (error) {
                console.error('Error inserting data into database:', error);
                return res.status(500).json({ error: 'An error occurred while processing your request.' });
            }
            return res.status(201).json({ message: 'User created successfully!' });
        }
    );
});

// Route to fetch all jobs from the database
app.get('/api/jobs', (req, res) => {
    connection.query('SELECT * FROM jobs', (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).json({ error: 'An error occurred while processing your request.' });
        } else {
            res.status(200).json(results);
        }
    });
});

//create or update
app.post('/api/jobs', (req, res) => {
    const jobId = req.body.id;
    const { role, company, description } = req.body;

    // First, check if the job with the given ID exists in the database
    if (jobId) {
        connection.query(
            'SELECT * FROM jobs WHERE id = ?',
            [jobId],
            (error, results) => {
                if (error) {
                    console.error('Error fetching job from database:', error);
                    res.status(500).json({ error: 'An error occurred while processing your request.' });
                    return;
                }

                if (results.length === 0) {
                    // If the job with the given ID is not found, return an error
                    res.status(404).json({ error: 'Job not found' });
                } else {
                    // If the job with the given ID is found, perform the update operation
                    connection.query(
                        'UPDATE jobs SET role = ?, company = ?, description = ? WHERE id = ?',
                        [role, company, description, jobId],
                        (error, results) => {
                            if (error) {
                                console.error('Error updating job in database:', error);
                                res.status(500).json({ error: 'An error occurred while processing your request.' });
                            } else {
                                res.json({ message: 'Job updated successfully!' });
                            }
                        }
                    );
                }
            }
        );
    }
    else {
        const { role, company, description } = req.body;

        if (!role || !company || !description) {
            res.status(400).json({ error: 'Role, company, and description are required fields.' });
            return;
        }

        connection.query(
            'INSERT INTO jobs (role, company, description) VALUES (?, ?, ?)',
            [role, company, description],
            (error, results) => {
                if (error) {
                    console.error('Error inserting data into database:', error);
                    res.status(500).json({ error: 'An error occurred while processing your request.' });
                } else {
                    res.status(201).json({ message: 'Job added successfully!' });
                }
            }
        );
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


module.exports = app;