const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
    {
        name: { type: String, require: true },
        email: { type: String, unique: true },
        password: { type: String, require: true },
        // isAdmin: {type: Boolean, default: false, require: true},
        phone: { type: Number, require: true },
        address: { type: String, require: true },
        avatar: { type: String },
        city: { type: String },
        role: { type: String },
    },
    {
        timestamps: true
    }
);
const User = mongoose.model("User", userSchema);
module.exports = User;