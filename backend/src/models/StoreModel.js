const mongoose = require('mongoose')
const storeSchema = new mongoose.Schema(
    {
        name: { type: String, require: true, unique: true },
        x: { type: Number, require: true },
        y: { type: Number, require: true },
        retailerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    },
    {
        timestamps: true
    }
);
const Store = mongoose.model("Store", storeSchema);
module.exports = Store;