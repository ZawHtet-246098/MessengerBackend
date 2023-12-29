const Messages = require("../models/Message");

module.exports.getMessages = async (req, res) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    console.log(projectedMessages);
    res.json(projectedMessages);
  } catch (error) {
    return res.status(404).json({
      success: false,
      msg: "There are no message for this room!!!",
    });
  }
};

module.exports.addMessages = async (req, res) => {
  try {
    const { from, to, msg } = req.body;
    const data = await Messages.create({
      message: { text: msg },
      users: [from, to],
      sender: from,
    });

    console.log(data);

    if (data) return res.json({ msg: "Message added successfully" });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (error) {
    return res.status(404).json({
      success: false,
      msg: "Failed to add message to the database!!!!",
    });
  }
};
