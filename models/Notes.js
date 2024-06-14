const mongoose = require("mongoose");

const NotesSchema = new mongoose.Schema({
  // this field of user is used to link the notes with the user who created it, because we don't want to show the notes of one user to another user
  user: {
    type: mongoose.Schema.Types.ObjectId, // if you relate to SQL, this is similar to foreign key
    ref: "user", // this is the name of the model to which this field is related to, in this case it is user model, means the model which store the user details like name, email, password etc
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tag: { type: String, default: "General" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("note", NotesSchema);