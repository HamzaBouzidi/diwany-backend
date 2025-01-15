import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// Define the EvaluationReport model
const EvaluationReport = sequelize.define('evaluation_report', {
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
 },
 nationality: {
  type: DataTypes.STRING,
  allowNull: false,
 },
 department: {
  type: DataTypes.STRING,
  allowNull: false,
 },
 section: {
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
 jobKnowledge: {
  type: DataTypes.STRING,
  allowNull: true,
 },
 technicalSkills: {
  type: DataTypes.STRING,
  allowNull: true,
 },
 teamwork: {
  type: DataTypes.STRING,
  allowNull: true,
 },
 problemSolving: {
  type: DataTypes.STRING,
  allowNull: true,
 },
 timeManagement: {
  type: DataTypes.STRING,
  allowNull: true,
 },
 decisionMaking: {
  type: DataTypes.STRING,
  allowNull: true,
 },
}, {
 freezeTableName: true,
 timestamps: false,
});

export default EvaluationReport;
