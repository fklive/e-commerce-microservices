import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description: string;
  parentId: mongoose.Types.ObjectId | null;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  parentId: { 
    type: mongoose.Types.ObjectId, 
    ref: 'Category', 
    default: null 
  },  },{ timestamps: true });

export default mongoose.model<ICategory>('Category', CategorySchema);