import mongoose from 'mongoose';
import Category, { ICategory } from '../models/category-model';

export class CategoryService {

    async createCategory(categoryData: {
        name: string;
        description: string;
        parentId: mongoose.Types.ObjectId | string | null;
    }): Promise<ICategory> {

        try {
             let parentIdValue = null;
             if (categoryData.parentId) {
                 parentIdValue = new mongoose.Types.ObjectId(categoryData.parentId.toString());
             }

            const category = new Category({
                name: categoryData.name,
                description: categoryData.description,
                parentId: categoryData.parentId
            });

            const savedCategory = await category.save();
            return savedCategory;
        } catch (error) {
            console.log("Hata : ",error)
            // MongoDB duplicate key hatası
            if (error.code === 11000) {
                throw new Error('Bu isimde bir kategori zaten mevcut');
            }

            throw error;
        }

    }

    async getCategories () : Promise<ICategory[]> {
        try {

            const categories = await Category.find();
            return categories;
            
        } catch (error) {
            console.log("Hata : ",error)

            throw error;
        }
    }

    async getCategoryById(categoryId : string) : Promise<ICategory | null> {
       
        try {

            const categoryById = await Category.findById(categoryId).populate('parentId','name');

            return categoryById;
            
        } catch (error) {
            console.error(`Kategori getirilemedi - ID: ${categoryId}`, error);

            throw error;
        }

    }

}