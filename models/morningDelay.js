import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const MorningDelay = sequelize.define('morningDelay', {
 employee_rw: {
  type: DataTypes.STRING,
  allowNull: false, // Must be provided
  validate: {
   isInt: {
    msg: 'employee_rw must be an integer',
   },
  },
 },

 // Basic Fields
 name: {
  type: DataTypes.STRING,
  allowNull: false,
  validate: {
   notEmpty: {
    msg: 'Name cannot be empty',
   },
  },
 },
 day: {
  type: DataTypes.DATEONLY,
  allowNull: false,
  validate: {
   isDate: {
    msg: 'Day must be a valid date',
   },
   notEmpty: {
    msg: 'Day cannot be empty',
   },
  },
 },
 time: {
  type: DataTypes.TIME,
  allowNull: false,
  validate: {
   notEmpty: {
    msg: 'Time cannot be empty',
   },
  },
 },
 description: {
  type: DataTypes.TEXT,
  allowNull: true,
 },

 // Boss Approval Fields
 bossApprovalStatus: {
  type: DataTypes.STRING,
  allowNull: true,
  defaultValue: 'Pending',
 },
 bossComment: {
  type: DataTypes.STRING,
  allowNull: true,
 },
 boss_rw: {
  type: DataTypes.STRING,
  allowNull: true,
  validate: {
   isInt: {
    msg: 'boss_rw must be an integer',
   },
  },
 },
 bossApprovalDate: {
  type: DataTypes.DATEONLY,
  allowNull: true,
  validate: {
   isDate: {
    msg: 'bossApprovalDate must be a valid date',
   },
  },
 },
}, {
 tableName: 'morning_delays',
 timestamps: true,
});

export default MorningDelay;
