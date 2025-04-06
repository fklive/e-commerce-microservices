import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

const ReviewSchema: Schema = new Schema({
  productId: { 
    type: mongoose.Types.ObjectId, 
    ref: 'Product',
    required: true 
  },
  userId: { 
    type: mongoose.Types.ObjectId, 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5
  },  
  comment: { type: String, required: false },
}, { timestamps: true });

export default mongoose.model<IReview>('Review', ReviewSchema);