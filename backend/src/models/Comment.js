const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
},
{
    timestamps: true
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;