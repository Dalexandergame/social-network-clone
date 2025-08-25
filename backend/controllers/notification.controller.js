import Notification from '../models/notification.model.js';

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id; // Get the current user's ID from the request
        const notifications = await Notification.find({ to: userId }).populate({path: 'from', select: 'username profileImage'}); // Populate 'from' field with username and profileImage

        await Notification.updateMany({ to: userId, read: false }, { $set: { read: true } }); // Mark all notifications as read

        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications in Controller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id; // Get the current user's ID from the request
        const result = await Notification.deleteMany({ to: userId }); // Delete all notifications for the user

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No notifications found to delete' });
        }

        res.status(200).json({ message: 'All notifications deleted successfully' });
    } catch (error) { 
        console.error('Error deleting notifications in Controller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteNotificationById = async (req, res) => {
    try {
        const userId = req.user._id; // Get the current user's ID from the request
        const notificationId = req.params.id; // Get the notification ID from the request parameters

        const notification = await Notification.findById(notificationId); // Find the notification by ID and user

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        await notification.remove(); // Remove the specific notification

        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        console.error('Error deleting notification by ID in Controller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}