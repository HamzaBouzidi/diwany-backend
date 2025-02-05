import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// Define the User model
const User = sequelize.define(
 'user',
 {
  USER_ID: {
   autoIncrement: true,
   type: DataTypes.BIGINT,
   allowNull: false,
   primaryKey: true,
  },
  user_name: {
   type: DataTypes.TEXT,
   allowNull: true,
  },
  user_email: {
   type: DataTypes.TEXT,
   allowNull: false,
  },
  user_psw: {
   type: DataTypes.TEXT,
   allowNull: true,
  },
  State: {
   type: DataTypes.BOOLEAN,
   allowNull: true,
  },
  user_phone: {
   type: DataTypes.TEXT,
   allowNull: true,
  },
  user_ref_emp: { // ✅ New Field for Employee Reference
   type: DataTypes.TEXT,
   allowNull: true,
  },

  // ✅ Vacation Permissions
  request_vacation: { type: DataTypes.BOOLEAN, defaultValue: 0 },
  view_vacation_list: { type: DataTypes.BOOLEAN, defaultValue: 0 },

  // ✅ Exit Authorization Permissions
  request_exit_auth: { type: DataTypes.BOOLEAN, defaultValue: 0 },
  view_exit_auth_list: { type: DataTypes.BOOLEAN, defaultValue: 0 },

  // ✅ Morning Delay Permissions
  request_morning_delay: { type: DataTypes.BOOLEAN, defaultValue: 0 },
  view_morning_delay_list: { type: DataTypes.BOOLEAN, defaultValue: 0 },

  // ✅ Nomination Permissions
  request_nomination: { type: DataTypes.BOOLEAN, defaultValue: 0 },
  view_nomination_list: { type: DataTypes.BOOLEAN, defaultValue: 0 },

  // ✅ Pledge Permissions
  request_pledge: { type: DataTypes.BOOLEAN, defaultValue: 0 },
  view_pledge_list: { type: DataTypes.BOOLEAN, defaultValue: 0 },

  // ✅ Release Permissions
  request_release: { type: DataTypes.BOOLEAN, defaultValue: 0 },
  view_release_list: { type: DataTypes.BOOLEAN, defaultValue: 0 }
 },
 {
  freezeTableName: true,
  timestamps: true,
 }
);


// Export the model
export default User;