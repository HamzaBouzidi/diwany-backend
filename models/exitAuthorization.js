import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ExitAuthorization = sequelize.define('ExitAuthorization', {
 employee_rw: {
  type: DataTypes.STRING,
  allowNull: false,
  validate: {
   isInt: {
    msg: 'employee_rw must be an integer',
   },
  },
 },

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
    msg: 'Exit authorization day must be a valid date',
   },
   notEmpty: {
    msg: 'Exit authorization day cannot be empty',
   },
  },
 },
 exitStartTime: {
  type: DataTypes.TIME,
  allowNull: false,
  validate: {
   notEmpty: {
    msg: 'Exit start time cannot be empty',
   },
  },
 },

 returnTime: {
  type: DataTypes.TIME,
  allowNull: false,
  validate: {
   notEmpty: {
    msg: 'Return time cannot be empty',
   },
   isAfterStart(value) {
    const start = new Date(`1970-01-01 ${this.exitStartTime}`);
    const end = new Date(`1970-01-01 ${value}`);
    if (end <= start) {
     throw new Error('Return time must be after the exit start time');
    }
   },
  },
 },

 exitDescription: {
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
 tableName: 'exit_authorizations',
 timestamps: true,
});

export default ExitAuthorization;
