import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Pledge = sequelize.define('Pledge', {
 employeeName: {
  type: DataTypes.STRING,
  allowNull: false,
 },
 employee_rw: {
  type: DataTypes.STRING,
  allowNull: false,

 },
 employeeDegree: {
  type: DataTypes.STRING,
  allowNull: false,

 },
 state: {
  type: DataTypes.ENUM('pending', 'approved', 'rejected'),
  defaultValue: 'pending', // Default state is pending
  allowNull: false,
 },
 documentLink: {
  type: DataTypes.STRING,
  allowNull: false,

 },
}, {
 tableName: 'Pledges',
 timestamps: true, 
});

export default Pledge;
