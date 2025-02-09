import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Notification = sequelize.define("Notification", {
 id: {
  type: DataTypes.INTEGER,
  autoIncrement: true,
  primaryKey: true,
 },
 text: {
  type: DataTypes.STRING,
  allowNull: false,
 },
 sender_id: {
  type: DataTypes.STRING,
  allowNull: false,
 },
 receiver_id: {
  type: DataTypes.STRING,
  allowNull: false,
 },
 is_read: {
  type: DataTypes.BOOLEAN,
  defaultValue: false,
 },
});

export default Notification;
