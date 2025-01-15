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
   //unique: true,
  },
  user_psw: {
   type: DataTypes.TEXT,
   allowNull: true,
  },
  State: {
   type: DataTypes.BOOLEAN,
   allowNull: true,
  },
  user_ref_emp: {
   type: DataTypes.TEXT,
   allowNull: true,
  },
  user_phone: {
   type: DataTypes.TEXT,
   allowNull: true,
  },
 },
 {
  freezeTableName: true,
  timestamps: true,
 }
);

// Export the model
export default User;