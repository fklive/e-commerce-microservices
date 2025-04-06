import mongoose, { Schema, Document } from 'mongoose';

export enum ProductStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    OUT_OF_STOCK = 'out_of_stock'
  }

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: mongoose.Types.ObjectId;
  status: ProductStatus;
  createdAt : Date;
  updatedAt : Date;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  images: { type: [String], required: true },
  categoryId: { 
    type: mongoose.Types.ObjectId, 
    ref:'Category', 
    required: true },
  status: { type: String, enum: Object.values(ProductStatus), default: ProductStatus.ACTIVE }  
}, { timestamps: true });

export default mongoose.model<IProduct>('Product', ProductSchema);