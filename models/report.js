import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Report = sequelize.define('workin_periode_report', {
 employee_rw: {
  type: DataTypes.STRING,
  allowNull: true,

 },
 employee_name: {
  type: DataTypes.STRING,
  allowNull: false,
 },
 employee_national_number: {
  type: DataTypes.STRING,
  allowNull: false,
  unique: true,
 },
 employee_department: {
  type: DataTypes.STRING,
  allowNull: false,
 },
 employee_job_title: {
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
 REPORT_ID: {
  autoIncrement: true,
  type: DataTypes.BIGINT,
  allowNull: false,
  primaryKey: true,
 },


 job_knowledge: {
  type: DataTypes.ENUM('average', 'below standard', 'above average'),
  allowNull: true,
 },

 job_mastery: {
  type: DataTypes.ENUM('average', 'below standard', 'above average'),
  allowNull: true,
 },
 job_communication_skills: {
  type: DataTypes.ENUM('average', 'below standard', 'above average'),
  allowNull: true,
 },
 job_problem_solving: {
  type: DataTypes.ENUM('average', 'below standard', 'above average'),
  allowNull: true,
 },
 job_time_management: {
  type: DataTypes.ENUM('average', 'below standard', 'above average'),
  allowNull: true,
 },
 job_decision_making: {
  type: DataTypes.ENUM('average', 'below standard', 'above average'),
  allowNull: true,
 },

 state: {
  type: DataTypes.ENUM('Pending', 'Done'),
  defaultValue: 'Pending', // Default state is pending
  allowNull: false,
 },



}, {
 freezeTableName: true,
 timestamps: false,
});

export default Report;
