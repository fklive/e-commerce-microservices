import { Request, Response } from 'express';
import { CategoryService } from '../services/category-service';
import { json } from 'stream/consumers';


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

}

  