import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// Define the Report model
const Report = sequelize.define('report', {
 REPORT_ID: {
  autoIncrement: true,
  type: DataTypes.BIGINT,
  allowNull: false,
  primaryKey: true,
 },
 name: {
  type: DataTypes.STRING,
  allowNull: false,
 },
 jobTitle: {
  type: DataTypes.STRING,
  allowNull: false,
 },
 nationalNumber: {
  type: DataTypes.STRING,
  allowNull: false,
  unique: true,
 },
 department: {
  type: DataTypes.STRING,
  allowNull: false,
 },
 startDate: {
  type: DataTypes.DATEONLY,
  allowNull: false,
 },
 endDate: {
  type: DataTypes.DATEONLY,
  allowNull: false,
 },
}, {
 freezeTableName: true,
 timestamps: false,
});

export default Report;
