import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  username:
  {
    type: String,
    required: true,
  },
  favoriteGenre: String
});

export default mongoose.model('Users', schema);

