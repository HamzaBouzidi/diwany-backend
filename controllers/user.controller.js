import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { Sequelize } from 'sequelize';
import https from 'https';



const JWT_SECRET = process.env.JWT_SECRET;
const apiKey = process.env.API_KEY;

export const register = async (req, res) => {
    const { user_name, user_email, password, user_ref_emp, user_phone, permissions } = req.body;
    const apiKey = '19af628cfa6df1828317a6268bbc0ce8814815e28a4aa7f36068b5d0e23ca1e7';

    console.log('Incoming request data:', req.body);

    // ✅ Validate required fields
    if (!user_name || !user_email || !password || !user_ref_emp) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // ✅ Check if the user already exists
        const existingUser = await User.findOne({ where: { user_email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // ✅ Call external API to verify user_ref_emp
        const apiResponse = await axios.get('https://ejaz.dewani.ly/ejaz/api/employees', {
            headers: {
                'apikey': apiKey,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        console.log('API response data:', JSON.stringify(apiResponse.data, null, 2));
        const employees = apiResponse.data;

        // ✅ Compare `user_ref_emp` to `rw`
        const matchedEmployee = employees.find(
            (emp) => String(emp.rw).trim() === String(user_ref_emp).trim()
        );

        if (!matchedEmployee) {
            return res.status(400).json({ message: 'Reference employee not found' });
        }

        // ✅ Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ✅ Default permissions (all `0`)
        const defaultPermissions = {
            request_vacation: 0, view_vacation_list: 0,
            request_exit_auth: 0, view_exit_auth_list: 0,
            request_morning_delay: 0, view_morning_delay_list: 0,
            request_nomination: 0, view_nomination_list: 0,
            request_pledge: 0, view_pledge_list: 0,
            request_release: 0, view_release_list: 0,
            request_cin: 0, view_cin_list: 0,
            request_health_assurance: 0, view_health_assurance_list: 0,
            request_reports: 0, view_reports: 0
        };

        // ✅ Merge default permissions with provided ones (if any)
        const assignedPermissions = { ...defaultPermissions, ...permissions };

        // ✅ Create new user with assigned permissions
        const newUser = await User.create({
            user_name,
            user_email,
            user_psw: hashedPassword,
            user_ref_emp,
            user_phone,
            State: true,
            ...assignedPermissions // ✅ Assign permissions dynamically
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
                job: user.b,
                vac: user.ras
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


export const updateUserPermissions = async (req, res) => {
    try {
        const { userId } = req.params; // Extract user ID from request parameters
        const updatedPermissions = req.body; // Extract permissions from request body

        // ✅ Check if user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'المستخدم غير موجود' });
        }

        // ✅ Update the user with new permissions
        await user.update(updatedPermissions);

        return res.status(200).json({ message: 'تم تحديث صلاحيات المستخدم بنجاح ✅', updatedPermissions });
    } catch (error) {
        console.error('❌ Error updating user permissions:', error);
        return res.status(500).json({ message: 'فشل تحديث الصلاحيات ❌' });
    }
};

// Function to get all users (for admin)
export const getAllUsers = async (req, res) => {
    try {
        // Fetch all users without specifying attributes (returns all fields)
        const users = await User.findAll();

        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
};


// Function to delete a user by ID
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the user
        await user.destroy();

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user' });
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

/*
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

*/


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

        const employees = apiResponse.data;

        // ✅ Count the number of employees per age
        const ageCounts = {};
        employees.forEach((employee) => {
            const age = employee.age;
            if (ageCounts[age]) {
                ageCounts[age] += 1;
            } else {
                ageCounts[age] = 1;
            }
        });

        // ✅ Ensure age 70 is included in the dataset
        if (!ageCounts[70]) {
            ageCounts[70] = 0;
        }

        // ✅ Convert data into an array of objects and sort by age
        const sortedAges = Object.entries(ageCounts)
            .map(([age, count]) => ({ age: Number(age), count }))
            .sort((a, b) => a.age - b.age);

        // ✅ Return the sorted age distribution
        res.status(200).json(sortedAges);
    } catch (error) {
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



export const getAllDepartments = async (req, res) => {
    try {
        // Fetch data from the API
        const apiUrl = 'https://ejaz.dewani.ly/ejaz/api/employees';
        const response = await axios.get(apiUrl, {
            headers: {
                'apikey': apiKey,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        // Extract data from the API response
        const employees = response.data;

        // Get unique departments (d field)
        const departments = [...new Set(employees.map(employee => employee.d))];

        // Return the unique departments
        res.status(200).json({
            success: true,
            departments,
        });
    } catch (error) {
        console.error('Error fetching departments:', error);

        // Handle errors
        res.status(500).json({
            success: false,
            message: 'Failed to fetch departments',
            error: error.message,
        });
    }
};

export const getDirectorsByDepartment = async (req, res) => {
    try {
        // Fetch data from the API
        const apiUrl = 'https://ejaz.dewani.ly/ejaz/api/employees';
        const response = await axios.get(apiUrl, {
            headers: {
                'apikey': apiKey,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        // Extract data from the API response
        const employees = response.data;

        // Filter employees with roles containing "مدير"
        const directors = employees.filter(employee => employee.b.includes('مدير'));

        // Group directors by department (d field)
        const directorsByDepartment = directors.reduce((acc, employee) => {
            if (!acc[employee.d]) {
                acc[employee.d] = [];
            }
            acc[employee.d].push({
                rw: employee.rw,
                name: employee.nm,
                role: employee.b,
                department: employee.d,
            });
            return acc;
        }, {});

        // Return the grouped directors
        res.status(200).json({
            success: true,
            directorsByDepartment,
        });
    } catch (error) {
        console.error('Error fetching directors:', error);

        // Handle errors
        res.status(500).json({
            success: false,
            message: 'Failed to fetch directors',
            error: error.message,
        });
    }
};



export const getDepartmentByEmployeeName = async (req, res) => {
    try {
        // Extract the employee name from the query parameters
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Employee name is required',
            });
        }

        // Fetch data from the API
        const apiUrl = 'https://ejaz.dewani.ly/ejaz/api/employees';
        const response = await axios.get(apiUrl, {
            headers: {
                'apikey': apiKey,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        // Extract data from the API response
        const employees = response.data;

        // Find the employee by name
        const employee = employees.find(emp => emp.nm === name);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: `No employee found with name: ${name}`,
            });
        }

        // Return the department
        res.status(200).json({
            success: true,
            department: employee.d,
        });
    } catch (error) {
        console.error('Error fetching department by employee name:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to fetch department',
            error: error.message,
        });
    }
};

export const getDirectorDepartmentByName = async (req, res) => {
    try {
        // Extract the director name from the query parameters
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Director name is required',
            });
        }

        // Fetch data from the API
        const apiUrl = 'https://ejaz.dewani.ly/ejaz/api/employees';
        const response = await axios.get(apiUrl, {
            headers: {
                'apikey': apiKey,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        // Extract data from the API response
        const employees = response.data;

        // Find the director by name and role containing "مدير"
        const director = employees.find(emp => emp.nm === name && emp.b.includes('مدير'));

        if (!director) {
            return res.status(404).json({
                success: false,
                message: `No director found with name: ${name}`,
            });
        }

        // Return the department
        res.status(200).json({
            success: true,
            department: director.d,
        });
    } catch (error) {
        console.error('Error fetching director department by name:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to fetch director department',
            error: error.message,
        });
    }
};



export const getDirectorByDepartment = async (req, res) => {
    try {
        // Extract the department name from the request parameters
        const { department } = req.query;

        if (!department) {
            return res.status(400).json({
                success: false,
                message: 'Department name is required',
            });
        }

        // Fetch data from the API
        const apiUrl = 'https://ejaz.dewani.ly/ejaz/api/employees';
        const response = await axios.get(apiUrl, {
            headers: {
                'apikey': apiKey,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        // Extract data from the API response
        const employees = response.data;

        // Find the director of the specified department
        const director = employees.find(
            (employee) =>
                employee.d === department && employee.b.includes('مدير')
        );

        if (!director) {
            return res.status(404).json({
                success: false,
                message: `No director found for department: ${department}`,
            });
        }

        // Return the director's information
        res.status(200).json({
            success: true,
            director: {
                rw: director.rw,
                name: director.nm,
                role: director.b,
                department: director.d,
            },
        });
    } catch (error) {
        console.error('Error fetching director by department:', error);

        // Handle errors
        res.status(500).json({
            success: false,
            message: 'Failed to fetch director information',
            error: error.message,
        });
    }
};
export const getEmployeeRwByName = async (req, res) => {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Employee name is required.',
            });
        }

        // Fetch employee data from the external API
        const apiUrl = 'https://ejaz.dewani.ly/ejaz/api/employees';
        const response = await axios.get(apiUrl, {
            headers: {
                'apikey': process.env.API_KEY,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        const employees = response.data;

        // Normalize and trim both input name and employee names to ensure accurate comparison
        const normalizedName = name.normalize('NFC').trim();
        const employee = employees.find((emp) =>
            emp.nm?.normalize('NFC').trim() === normalizedName
        );

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: `Employee with name "${name}" not found.`,
            });
        }

        // Return the employee's `rw` value
        res.status(200).json({
            success: true,
            employee: {
                name: employee.nm,
                rw: employee.rw,
            },
        });
    } catch (error) {
        console.error('Error fetching employee reference:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch employee reference.',
            error: error.message,
        });
    }
};



export const getDirectorRw = async (req, res) => {
    const { employeeId } = req.params;
    const url = `https://ejaz.dewani.ly/ejaz/api/employees/${employeeId}/manager`;

    try {
        const response = await axios.get(url, {
            headers: {
                'apikey': apiKey,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        return res.status(200).json({ rw: response.data.rw });
    } catch (error) {
        console.error('Error fetching director RW:', error.response ? error.response.data : error.message);
        return res.status(500).json({
            message: 'Failed to fetch director RW.',
            error: error.response ? error.response.data : error.message,
        });
    }
};


export const getUserAuthorizations = async (req, res) => {
    const { user_ref_emp } = req.params;

    try {
        // Find user by reference ID
        const user = await User.findOne({
            where: { user_ref_emp },
            attributes: [
                'request_vacation', 'view_vacation_list',
                'request_exit_auth', 'view_exit_auth_list',
                'request_morning_delay', 'view_morning_delay_list',
                'request_nomination', 'view_nomination_list',
                'request_pledge', 'view_pledge_list',
                'request_release', 'view_release_list',
                'request_cin', 'view_cin_list',
                'request_health_assurance', 'view_health_assurance_list',
                'request_reports', 'view_reports',

            ]
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ permissions: user });
    } catch (error) {
        console.error('Error fetching user authorizations:', error);
        return res.status(500).json({ message: 'Error fetching user authorizations' });
    }
};
