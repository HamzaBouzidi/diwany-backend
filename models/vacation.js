import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// Define the Vacation model
const Vacation = sequelize.define('Vacation', {
 // Employee Reference ID (employee who requested vacation)
 employee_rw: {
  type: DataTypes.STRING,
  allowNull: false,  // Employee reference ID is required
  validate: {
   isInt: {
    msg: 'employee_rw must be an integer'
   }
  }
 },

 name: {
  type: DataTypes.STRING,
  allowNull: false,
  validate: {
   notEmpty: {
    msg: 'Name cannot be empty'
   }
  }
 },
 department: {
  type: DataTypes.STRING,
  allowNull: false,
  validate: {
   notEmpty: {
    msg: 'Department cannot be empty'
   }
  }
 },
 vacationDays: {
  type: DataTypes.INTEGER,
  allowNull: false,
  validate: {
   min: 1,
   max: 30,
   notEmpty: {
    msg: 'Vacation days cannot be empty'
   }
  }
 },
 vacationStartDay: {
  type: DataTypes.DATEONLY,
  allowNull: false,
  validate: {
   isDate: {
    msg: 'Vacation start day must be a valid date'
   },
   notEmpty: {
    msg: 'Vacation start day cannot be empty'
   }
  }
 },
 vacationEndDate: {
  type: DataTypes.DATEONLY,
  allowNull: false,
  validate: {
   isDate: {
    msg: 'Vacation end date must be a valid date'
   },
   isAfterStart(value) {
    if (new Date(value) < new Date(this.vacationStartDay)) {
     throw new Error('Vacation end date must be after the start date');
    }
   }
  }
 },
 vacationDescription: {
  type: DataTypes.TEXT,
  allowNull: true  // Description can be optional
 },

 // Approval Fields
 bossApprovalStatus: {
  type: DataTypes.STRING,
  allowNull: true,
  defaultValue: 'Pending',  // Default approval status
 },
 bossComment: {
  type: DataTypes.STRING,
  allowNull: true  // Optional comment for the boss
 },
 boss_rw: {
  type: DataTypes.STRING,
  allowNull: true,  // Boss reference employee ID
  validate: {
   isInt: {
    msg: 'boss_rw must be an integer'
   }
  }
 },
 bossApprovalDate: {
  type: DataTypes.DATEONLY,
  allowNull: true,  // Date when the boss approved the vacation
  validate: {
   isDate: {
    msg: 'bossApprovalDate must be a valid date'
   }
  }
 }

}, {
 tableName: 'vacations',  // Table name in the DB
 timestamps: true,  // Enable createdAt, updatedAt
});

export default Vacation;
