import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// Define the Release model
const Release = sequelize.define('release', {
 directorName: {
  type: DataTypes.STRING,
  allowNull: false,
 },
 employeeName: {
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

 // Row 1
 R1_direction: {
  type: DataTypes.STRING,
  allowNull: true,
 },
 R1_name: {
  type: DataTypes.STRING,
  allowNull: true,
 },
 R1_date: {
  type: DataTypes.DATEONLY,
  allowNull: true,
 },
 R1_notes: {
  type: DataTypes.TEXT,
  allowNull: true,
 },
 R1_position: {
  type: DataTypes.STRING,
  allowNull: true,
 },

 // Row 2
 R2_direction: {
  type: DataTypes.STRING,
  allowNull: true,
 },
 R2_name: {
  type: DataTypes.STRING,
  allowNull: true,
 },
 R2_date: {
  type: DataTypes.DATEONLY,
  allowNull: true,
 },
 R2_notes: {
  type: DataTypes.TEXT,
  allowNull: true,
 },
 R2_position: {
  type: DataTypes.STRING,
  allowNull: true,
 },

 // Row 3
 R3_direction: {
  type: DataTypes.STRING,
  allowNull: true,
 },
 R3_name: {
  type: DataTypes.STRING,
  allowNull: true,
 },
 R3_date: {
  type: DataTypes.DATEONLY,
  allowNull: true,
 },
 R3_notes: {
  type: DataTypes.TEXT,
  allowNull: true,
 },
 R3_position: {
  type: DataTypes.STRING,
  allowNull: true,
 },

 // Row 4
 R4_direction: {
  type: DataTypes.STRING,
  allowNull: true,
 },
 R4_name: {
  type: DataTypes.STRING,
  allowNull: true,
 },
 R4_date: {
  type: DataTypes.DATEONLY,
  allowNull: true,
 },
 R4_notes: {
  type: DataTypes.TEXT,
  allowNull: true,
 },
 R4_position: {
  type: DataTypes.STRING,
  allowNull: true,
 },

 // Row 5
 R5_direction: {
  type: DataTypes.STRING,
  allowNull: true,
 },
 R5_name: {
  type: DataTypes.STRING,
  allowNull: true,
 },
 R5_date: {
  type: DataTypes.DATEONLY,
  allowNull: true,
 },
 R5_notes: {
  type: DataTypes.TEXT,
  allowNull: true,
 },
 R5_position: {
  type: DataTypes.STRING,
  allowNull: true,
 },

 // Row 6
 R6_direction: {
  type: DataTypes.STRING,
  allowNull: true,
 },
 R6_name: {
  type: DataTypes.STRING,
  allowNull: true,
 },
 R6_date: {
  type: DataTypes.DATEONLY,
  allowNull: true,
 },
 R6_notes: {
  type: DataTypes.TEXT,
  allowNull: true,
 },
 R6_position: {
  type: DataTypes.STRING,
  allowNull: true,
 },
}, {
 freezeTableName: true,
 timestamps: false,
});

export default Release;
