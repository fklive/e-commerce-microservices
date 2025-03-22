import { Router } from 'express';
import { UserController } from '../controllers/user-controller';

const router = Router();
const userController = new UserController();

// Register endpoint
router.post('/register', userController.register);
router.get('/login', userController.login);

export default router;