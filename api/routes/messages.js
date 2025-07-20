const router = require("express").Router();
const Messages = require('../Models/Message');

// add
router.post("/", async (req, res) => {
  const newMessage = new Messages(req.body);
  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);

  } catch (err) {
    res.status(500).json(err);
  }
})

//get
router.get("/:conversationId", async (req, res) => {
  try {
    const message = await Messages.find({
      conversationId: req.params.conversationId,
    }).populate({
      path: "replyTo",
      populate: {
        path: "sender",
        model: "User",
        select: "username"
      }
    })

    res.status(200).json(message);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete
router.delete("/:messageId", async (req, res) => {
  try {
    const message = await Messages.findById(req.params.messageId);
    if (message.sender !== req.body.userId) {
      return res.status(403).json("You can delete only your own messages");
    }
    await message.deleteOne();
    res.status(200).json("Message deleted successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Mark a message as seen
router.put("/seen/:id", async (req, res) => {
  try {
    const updatedMsg = await Messages.findByIdAndUpdate(
      req.params.id,
      { isSeen: true },
      { new: true }
    );
    res.status(200).json(updatedMsg);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Mark all messages as seen in a conversation
router.put("/seen/conversation/:conversationId", async (req, res) => {
  try {
    await Messages.updateMany(
      { conversationId: req.params.conversationId, receiver: req.body.userId, isSeen: false },
      { $set: { isSeen: true } }
    );
    res.status(200).json("All messages marked as seen");
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;