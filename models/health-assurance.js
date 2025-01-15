import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const HealthAssurance = sequelize.define(
 'health_assurance',
 {
  id: {
   type: DataTypes.BIGINT,
   autoIncrement: true,
   allowNull: false,
   primaryKey: true,
  },
  name: {
   type: DataTypes.STRING,
   allowNull: false,
  },
  father_name: {
   type: DataTypes.STRING,
   allowNull: false,
  },
  grandfather_name: {
   type: DataTypes.STRING,
   allowNull: false,
  },
  family_last_name: {
   type: DataTypes.STRING,
   allowNull: false,
  },
  administration: {
   type: DataTypes.STRING,
   allowNull: false,
  },
  mother_name: {
   type: DataTypes.STRING,
   allowNull: false,
  },
  mother_last_name: {
   type: DataTypes.STRING,
   allowNull: false,
  },
  family_members_list: {
   type: DataTypes.TEXT, // Changed from JSON to TEXT
   allowNull: false,
  },
  employee_rw: {
   type: DataTypes.STRING,
   allowNull: false,
  },
  birth_certificate: {
   type: DataTypes.STRING,
   allowNull: true,
  },
  family_state_certificate: {
   type: DataTypes.STRING,
   allowNull: true,
  },
  state: {
   type: DataTypes.STRING, // State: Pending, Approved, Rejected
   defaultValue: 'Pending',
   allowNull: false,
  },
 },
 {
  freezeTableName: true,
  timestamps: false,
 }
);

export default HealthAssurance;
