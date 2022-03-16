import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  title:{
    type: String,
    required: true,
    unique: true,
    minlength: 2
  },
  published: Number,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  },
  genres: [String]
});

export default mongoose.model('Book', schema);