const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    // username: { type: String, required: true, unique: true },
    // notes: [    // Array of notes
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'note'
    //     }
    // ],
    password: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const User = mongoose.model('user', UserSchema);
module.exports = User;