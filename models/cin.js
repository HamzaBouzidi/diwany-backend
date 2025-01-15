import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';


const Cin = sequelize.define(
 'cin',
 {
  CIN_ID: {
   autoIncrement: true,
   type: DataTypes.BIGINT,
   allowNull: false,
   primaryKey: true,
  },
  user_name: {
   type: DataTypes.TEXT,
   allowNull: true,
  },

  user_num: {
   type: DataTypes.TEXT,
   allowNull: true,
  },
  user_natio_num: {
   type: DataTypes.TEXT,
   allowNull: true,
  },
  user_sifa: {
   type: DataTypes.TEXT,
   allowNull: true,
  },

  user_ref_emp: {
   type: DataTypes.TEXT,
   allowNull: true,
  },
  state: {
   type: DataTypes.BOOLEAN,
   defaultValue: false,
   allowNull: false,
  },

 },
 {
  freezeTableName: true, // Prevent Sequelize from pluralizing table names
  timestamps: false, // Disable createdAt and updatedAt timestamps
 }
);

// Export the model
export default Cin;