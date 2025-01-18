import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const NominationFormVisibility = sequelize.define('NominationFormVisibility', {
 isVisible: {
  type: DataTypes.BOOLEAN,
  defaultValue: false, // Default to hidden
  allowNull: false,
 },
});

export default NominationFormVisibility;
