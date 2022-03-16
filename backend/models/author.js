import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name:{
    type:String,
    required: true,
    unique: true,
    minlength: 4
  },
  born: Number,
});

export default mongoose.model('Authors', schema);