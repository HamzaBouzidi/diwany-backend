import axios from 'axios';
/*
export const getUserManager = async (user_rw) => {
 const API_KEY = process.env.API_KEY_GET_ADMIN;
 const url = `https://ejaz.dewani.ly/ejaz/api/employees/${user_rw}/manager`;

 try {
  const response = await axios.get(url, {
   headers: {
    'apikey': API_KEY
   }
  });

  return response.data.rw;  // Returning the manager's rw
 } catch (error) {
  console.error('Error fetching user manager:', error);
  throw new Error('Could not fetch manager data');
 }
};



export const getEmployeeListByManager = async (manager_rw) => {
 const apiKey = process.env.API_KEY;

 try {
  const response = await axios.get(`https://ejaz.dewani.ly/ejaz/api/employees/${manager_rw}/employees`, {
   headers: {
    'apikey': apiKey
   },
  });

  // If the response status is 204 (No Content), return an empty array
  if (response.status === 204) {
   console.log('No employees found for this manager');
   return [];
  }

  // Ensure response.data is an array before using map
  if (Array.isArray(response.data)) {
   // Extract the 'rw' for each employee if it's an array
   const employeeRws = response.data.map(employee => employee.rw);
   return employeeRws;
  } else {
   throw new Error('Unexpected data structure: response.data is not an array');
  }

 } catch (error) {
  console.error('Error fetching employee list:', error);
  throw new Error('Unable to fetch employee list');
 }
};
*/

import https from 'https'; // Required for disabling SSL certificate validation

// Create an Axios instance with SSL bypass (use for expired certificates in development only)
const axiosInstance = axios.create({
 httpsAgent: new https.Agent({
  rejectUnauthorized: false, // Bypass SSL certificate validation
 }),
});

// Function to get the user manager
export const getUserManager = async (user_rw) => {
 const API_KEY = process.env.API_KEY_GET_ADMIN;
 const url = `https://ejaz.dewani.ly/ejaz/api/employees/${user_rw}/manager`;

 try {
  const response = await axiosInstance.get(url, {
   headers: {
    'apikey': API_KEY,
   },
  });

  return response.data.rw; // Returning the manager's rw
 } catch (error) {
  console.error('Error fetching user manager:', error);
  throw new Error('Could not fetch manager data');
 }
};

// Function to get employee list by manager
export const getEmployeeListByManager = async (manager_rw) => {
 const apiKey = process.env.API_KEY;

 try {
  const response = await axiosInstance.get(
   `https://ejaz.dewani.ly/ejaz/api/employees/${manager_rw}/employees`,
   {
    headers: {
     'apikey': apiKey,
    },
   }
  );

  // If the response status is 204 (No Content), return an empty array
  if (response.status === 204) {
   console.log('No employees found for this manager');
   return [];
  }

  // Ensure response.data is an array before using map
  if (Array.isArray(response.data)) {
   // Extract the 'rw' for each employee if it's an array
   const employeeRws = response.data.map((employee) => employee.rw);
   return employeeRws;
  } else {
   throw new Error('Unexpected data structure: response.data is not an array');
  }
 } catch (error) {
  console.error('Error fetching employee list:', error);
  throw new Error('Unable to fetch employee list');
 }
};