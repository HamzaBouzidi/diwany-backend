import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// Define the Release model
const Release = sequelize.define(
 'release',
 {
  directorName: {
   type: DataTypes.STRING,
   allowNull: false,
  },
  directorRw: {
   type: DataTypes.STRING,
   allowNull: false,
  },
  employeeName: {
   type: DataTypes.STRING,
   allowNull: false,
  },
  employeeRw: {
   type: DataTypes.STRING,
   allowNull: false,
  },
  department: {
   type: DataTypes.STRING,
   allowNull: false,
  },
  reason: {
   type: DataTypes.TEXT,
   allowNull: false,
  },
  state: {
   type: DataTypes.ENUM('Pending', 'Approved', 'Declined'),
   allowNull: false,
   defaultValue: 'Pending', // Default state
  },
 },
 {
  freezeTableName: true,
  timestamps: true, // Enable createdAt and updatedAt fields
 }
);

export default Release;
