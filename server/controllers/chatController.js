import Chat from "../models/Chat.js";

export const getMyChats = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id })
      .select("title summary createdAt updatedAt")
      .sort({ updatedAt: -1 });
    res.json({ chats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.json({ chat });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createChat = async (req, res) => {
  try {
    const chat = await Chat.create({ user: req.user._id });
    res.status(201).json({ chat });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const saveMessage = async (req, res) => {
  try {
    const { messages, title, summary } = req.body;
    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        $set: {
          messages,
          ...(title && { title }),
          ...(summary && { summary }),
        },
      },
      { new: true },
    );
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.json({ chat });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteChat = async (req, res) => {
  try {
    await Chat.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: "Chat deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
