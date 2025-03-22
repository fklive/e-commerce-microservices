import { Router } from 'express';
import { UserController } from '../controllers/user-controller';
import { authMiddleware } from '../middleware/auth-middleware';

const router = Router();
const userController = new UserController();


router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', authMiddleware, userController.getProfile);

export default router;