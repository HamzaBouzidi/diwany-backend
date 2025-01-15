import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { Sequelize } from 'sequelize';
import https from 'https';



const JWT_SECRET = process.env.JWT_SECRET;
const apiKey = process.env.API_KEY;



export const register = async (req, res) => {
    const { user_name, user_email, password, user_ref_emp, user_phone } = req.body;
    const apiKey = '19af628cfa6df1828317a6268bbc0ce8814815e28a4aa7f36068b5d0e23ca1e7';

    console.log('Incoming request data:', req.body);

    if (!user_name || !user_email || !password || !user_ref_emp) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const existingUser = await User.findOne({ where: { user_email } });
        console.log('Existing user check result:', existingUser);

        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // Call the external API and log the response
        const apiResponse = await axios.get('https://ejaz.dewani.ly/ejaz/api/employees', {
            headers: {
                'apikey': apiKey,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        console.log('API response data:', JSON.stringify(apiResponse.data, null, 2));

        const employees = apiResponse.data; // Adjust this if necessary based on response structure

        console.log('user_ref_emp:', user_ref_emp);
        employees.forEach(emp => {
            console.log('Comparing against employee rw:', emp.rw);
        });

        // Now comparing user_ref_emp to rw instead of no
        const matchedEmployee = employees.find(
            (emp) => String(emp.rw).trim() === String(user_ref_emp).trim()
        );

        console.log('Matched employee:', matchedEmployee);

        if (!matchedEmployee) {
            return res.status(400).json({ message: 'Reference employee not found' });
        }

        // Hash the password asynchronously
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            user_name,
            user_email,
            user_psw: hashedPassword,
            user_ref_emp,
            user_phone,
            State: true,
        });

        return res.status(201).json({ message: 'User registered successfully', newUser });
    } catch (error) {
        console.error('Error during user registration:', error);

        if (error.response) {
            return res.status(400).json({ message: `Error from external API: ${error.response.data}` });
        }

        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: 'Validation error', details: error.errors });
        }

        return res.status(500).json({ message: 'Internal server error' });
    }
};



// Login function 
export const login = async (req, res) => {
    const { user_email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ where: { user_email } });

        // If the user does not exist
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user's state is true (active)
        if (!user.State) {
            return res.status(403).json({ message: 'Account is inactive, please contact admin.' });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = bcrypt.compareSync(password, user.user_psw);

        // If the password is incorrect
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // If login is successful, generate a JWT
        const token = jwt.sign(
            {
                id: user.USER_ID,
                name: user.user_name,
                email: user.user_email,
                ref_emp: user.user_ref_emp,
                phone: user.user_phone,
                state: user.State,
                job: user.b
            },
            JWT_SECRET,  // Use the secret from the .env file
            { expiresIn: '12h' }
        );

        // Send the JWT and user details in the response
        return res.status(200).json({
            message: 'Login successful!',
            token,
            user: {
                id: user.USER_ID,
                name: user.user_name,
                email: user.user_email,
                job: user.user_job,
                user_ref_emp: user.user_ref_emp,
                job: user.job
            }
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Error logging in',
            error: err.message
        });
    }
};


// Function to get all users (for admin)
export const getAllUsers = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.findAll({
            attributes: ['USER_ID', 'user_name', 'user_email', 'State', 'user_job', 'user_role', 'user_ref_emp']  // Select only the fields you want to return
        });

        // Return the users in the response
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
};



// Function to update the user's state (for admin)
export const updateUserState = async (req, res) => {
    const { user_ref_emp } = req.params;  // Get user ID from request params
    const { newState } = req.body;

    try {
        // Find the user by ID
        const user = await User.findByPk(user_ref_emp);

        // If the user does not exist
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's state
        user.State = newState;

        // Save the changes to the database
        await user.save();

        // Return a success message
        res.status(200).json({ message: 'User state updated successfully', user });
    } catch (error) {
        console.error('Error updating user state:', error);
        res.status(500).json({ message: 'Error updating user state' });
    }
};
/*
const apiKey = '19af628cfa6df1828317a6268bbc0ce8814815e28a4aa7f36068b5d0e23ca1e7';
export const getUserInfo = async (req, res) => {
    const { user_ref_emp } = req.params;


    try {
        // Make the API call to get the list of employees
        const apiResponse = await axios.get('https://ejaz.dewani.ly/ejaz/api/employees', {
            headers: {
                'apikey': apiKey,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        // Log the API response to see if you're getting data
        console.log(apiResponse.data);

        // Find the user with the matching user_ref_emp
        const user = apiResponse.data.find(employee => employee.rw === user_ref_emp);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send back the user data as a response
        res.status(200).json(user);
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Error retrieving user information', error: error.message });
    }
};

*/
export const getUserInfo = async (req, res) => {
    const { user_ref_emp } = req.params;

    try {
        // Create an HTTPS agent with SSL certificate validation disabled
        const agent = new https.Agent({
            rejectUnauthorized: false, // Bypass SSL certificate validation
        });

        // Make the API call to get the list of employees
        const apiResponse = await axios.get('https://ejaz.dewani.ly/ejaz/api/employees', {
            httpsAgent: agent, // Use the configured agent
            headers: {
                'apikey': apiKey,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        // Log the API response to see if you're getting data
        console.log(apiResponse.data);

        // Find the user with the matching user_ref_emp
        const user = apiResponse.data.find((employee) => employee.rw === user_ref_emp);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send back the user data as a response
        res.status(200).json(user);
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Error retrieving user information', error: error.message });
    }
};






export const getDistinctCountAgeALLEmployee = async (req, res) => {

    try {
        // Make the API call to get the list of employees
        const apiResponse = await axios.get('https://ejaz.dewani.ly/ejaz/api/employees', {
            headers: {
                'apikey': apiKey,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });



        // Find the user with the matching user_ref_emp
        const user = apiResponse.data;

        const dataMap = {};
        user.forEach(item => {

            dataMap[item.age] = 'Age';

        });
        const newTournament = Object.keys(dataMap);

        if (!newTournament) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send back the user data as a response
        res.status(200).json(newTournament);
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Error retrieving user information', error: error.message });
    }

};





export const getStatSpeciality = async (req, res) => {

    try {
        // Make the API call to get the list of employees
        const apiResponse = await axios.get('https://ejaz.dewani.ly/ejaz/api/employees', {
            headers: {
                'apikey': apiKey,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        // Find the user with the matching user_ref_emp
        const user = apiResponse.data;
        const dataMap = [];
        user.forEach(item => { dataMap[item.d1] = ['d1'] });
        const newTournament = Object.keys(dataMap);
        const jsonArray = newTournament.map((item) => ({
            "count": apiResponse.data.filter(employee => employee.d1 === item).length,
            "descrip": item
        }));
        if (!newTournament) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Send back the user data as a response
        res.status(200).json(jsonArray);
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Error retrieving user information', error: error.message });
    }

};





export const getStatJob = async (req, res) => {

    try {
        // Make the API call to get the list of employees
        const apiResponse = await axios.get('https://ejaz.dewani.ly/ejaz/api/employees', {
            headers: {
                'apikey': apiKey,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        // Find the user with the matching user_ref_emp
        const user = apiResponse.data;
        const dataMap = [];
        user.forEach(item => { dataMap[item.b] = ['b'] });
        const newTournament = Object.keys(dataMap);
        const jsonArray = newTournament.map((item) => ({
            "count": apiResponse.data.filter(employee => employee.b === item).length,
            "descrip": item
        }));
        if (!newTournament) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Send back the user data as a response
        res.status(200).json(jsonArray);
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Error retrieving user information', error: error.message });
    }

};


export const getDiplome = async (req, res) => {

    try {
        // Make the API call to get the list of employees
        const apiResponse = await axios.get('https://ejaz.dewani.ly/ejaz/api/employees', {
            headers: {
                'apikey': apiKey,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        // Find the user with the matching user_ref_emp
        const user = apiResponse.data;
        const dataMap = [];
        user.forEach(item => { dataMap[item.h11] = ['b'] });
        const newTournament = Object.keys(dataMap);
        const jsonArray = newTournament.map((item) => ({
            "count": apiResponse.data.filter(employee => employee.h11 === item).length,
            "descrip": item
        }));
        if (!newTournament) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Send back the user data as a response
        res.status(200).json(jsonArray);
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Error retrieving user information', error: error.message });
    }

};
// Function to count user accounts created per month
export const getAccountCountByMonth = async (req, res) => {
    try {
        const userCounts = await User.findAll({
            attributes: [
                [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
                [Sequelize.fn('YEAR', Sequelize.col('createdAt')), 'year'],
                [Sequelize.fn('COUNT', Sequelize.col('USER_ID')), 'count'],
            ],
            group: ['month', 'year'],
            order: [
                [Sequelize.fn('YEAR', Sequelize.col('createdAt')), 'ASC'],
                [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'ASC'],
            ],
        });

        res.json(userCounts);
    } catch (error) {
        console.error('Error fetching account counts by month:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};



export const get_linked_department = async (req, res) => {
    const { refj } = req.params;


    try {
        // Make the API call to get the list of JOBS
        const apiResponse = await axios.get('https://ejaz.dewani.ly/ejaz/api/jobs', {
            headers: {
                'apikey': apiKey,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        // Log the API response to see if you're getting data

        // Find the user with the matching REF
        const list_job = apiResponse.data.find(JOBS => JOBS.cf === refj);

        if (!list_job) {
            return res.status(404).json({ message: 'jobs not found' });
        }

        // Send back the jobs data as a response
        res.status(200).json(apiResponse);
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Error retrieving job information', error: error.message });
    }
};

