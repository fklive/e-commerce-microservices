import { Router } from 'express';
import { authMiddleware } from '../middleware/auth-middleware';
import { checkRole } from '../middleware/user-role-middleware';
import {CategoryController} from '../controllers/category-controller'

const router = Router();
const categoryController = new CategoryController();

router.post('/', authMiddleware, checkRole(['admin']), categoryController.createCategory );
router.get('/', categoryController.getCategories );
router.get('/:id', categoryController.getCategoryById );

export default router;