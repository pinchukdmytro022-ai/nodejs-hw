import { Schema, model } from 'mongoose';

const noteSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, trim: true, required: false, default: '' },
    tag: {
      
    },
  },
  { timestamps: true, versionKey: false },
);

const Note = model('Note', noteSchema);
export default Note;
