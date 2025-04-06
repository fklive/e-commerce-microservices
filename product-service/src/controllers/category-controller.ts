import { Request, Response } from 'express';
import { CategoryService } from '../services/category-service';
import { json } from 'stream/consumers';
import mongoose from 'mongoose';


export class CategoryController {

    private categoryService : CategoryService;

    constructor() {
        this.categoryService = new CategoryService();
    }

    createCategory = async (req: Request, res: Response): Promise<any> => {

        try {
            const { name, description, parentId} = req.body;

            if(!name || !description){
              return  res.status(400).json({
                success : false,
                message : "İsim ve açıklama değeri dolu olmalıdır!"
              });
            }

            const category = await this.categoryService.createCategory({
                name,
                description,
                parentId
            });

            return res.status(201).json({
                success: true,
                data: category,
                message: "Kategori başarı ile oluşturuldu."
            });
        } catch (error) {
            console.log("Kategori kaydı oluşturulamadı : ",error);
        
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
              });
        }
    } 

    getCategories = async (req: Request, res: Response) : Promise<any> => {
        try {

            const categories = await this.categoryService.getCategories();
   
            return res.status(200).json({
                success : true,
                data: categories,
                message : "Kategori getirme işlemi başarılı!"
            });
            
        } catch (error) {
            console.log("Kategoriler getirilemedi : ",error);
        
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
              });
        }
    }

    getCategoryById = async (req: Request, res: Response) : Promise<any> => {
        try {

            const categoryId = req.params.id;

            if (!mongoose.Types.ObjectId.isValid(categoryId)) {
                return res.status(400).json({
                  success: false,
                  message: "Geçersiz kategori ID formatı"
                });
              }

            const category = await this.categoryService.getCategoryById(categoryId);

            if (!category) {
                return res.status(404).json({
                  success: false,
                  message: "Kategori bulunamadı"
                });
              }
              
              return res.status(200).json({
                success: true,
                data: category,
                message: "Kategori başarıyla getirildi"
              });

            
        } catch (error) {
            console.log("Kategori getirilemedi : ",error);
        
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
              });
        }
    }

}

  