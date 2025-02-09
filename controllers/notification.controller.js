import Notification from "../models/notification.js";

// Ajouter une notification
export const createNotification = async (req, res) => {
 try {
  const { text, sender_id, receiver_id } = req.body;

  if (!text || !sender_id || !receiver_id) {
   return res.status(400).json({ message: "Tous les champs sont requis" });
  }

  const notification = await Notification.create({ text, sender_id, receiver_id });
  res.status(201).json({ message: "Notification ajoutée", notification });
 } catch (error) {
  res.status(500).json({ error: error.message });
 }
};

// Récupérer les notifications d'un employé
export const getNotificationsByReceiver = async (req, res) => {
 try {
  const { receiverId } = req.params;

  const notifications = await Notification.findAll({
   where: { receiver_id: receiverId },
   order: [["createdAt", "DESC"]],
  });

  res.status(200).json(notifications);
 } catch (error) {
  res.status(500).json({ error: error.message });
 }
};

// Supprimer une notification
export const deleteNotification = async (req, res) => {
 try {
  const { id } = req.params;

  const deleted = await Notification.destroy({ where: { id } });
  if (!deleted) {
   return res.status(404).json({ message: "Notification non trouvée" });
  }

  res.status(200).json({ message: "Notification supprimée" });
 } catch (error) {
  res.status(500).json({ error: error.message });
 }
};
