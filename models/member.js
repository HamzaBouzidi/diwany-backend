import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// Define the User model
const Member = sequelize.define(
 'member',
 {
  MEMBER_ID: {
   autoIncrement: true,
   type: DataTypes.BIGINT,
   allowNull: false,
   primaryKey: true,
  },
  user_name: {
   type: DataTypes.TEXT,
   allowNull: true,
  },
  user_direction_nomi: {
   type: DataTypes.TEXT,
   allowNull: false,
 //  unique: true,
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
  user_cu_direction: {
   type: DataTypes.TEXT,
   allowNull: true,
  },

  start_day: {
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
  user_dipl: {
   type: DataTypes.TEXT,
   allowNull: true,
  },


  user_exp: {
   type: DataTypes.TEXT,
   allowNull: true,
  },
  user_natio: {
   type: DataTypes.TEXT,
   allowNull: true,
  },
  user_ref_emp: {
   type: DataTypes.TEXT,
   allowNull: true,
  },
 },

 {
  freezeTableName: true, // Prevent Sequelize from pluralizing table names
  timestamps: false, // Disable createdAt and updatedAt timestamps
 }
);

// Export the model
export default Member;