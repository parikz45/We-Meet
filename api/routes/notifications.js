const router = require("express").Router();
const Notifications = require("../Models/Notifications");

// create a new notification
router.post("/", async (req, res) => {
    try {
        const notification = new Notifications(req.body);
        const saved = await notification.save();
        res.status(200).json(saved);
    } catch (err) {
        res.status(400).json(err);
    }
})

// Get all notifications of a user
router.get("/:userId", async (req, res) => {
    try {
        const notifications = await Notifications.find({ recieverId: req.params.userId }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (err) {
        res.status(400).json(err);
    }
})

// Mark a notification as read
router.put("/read/:id", async (req, res) => {
    try {
        const updated = await Notifications.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        if (!updated) {
            return res.status(404).json({ error: "Notification not found" });
        }
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json(err);
    }
})

module.exports = router;