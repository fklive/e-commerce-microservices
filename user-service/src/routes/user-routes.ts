import { Router } from 'express';
import { UserController } from '../controllers/user-controller';

const router = Router();
const userController = new UserController();

// Register endpoint
router.post('/register', userController.register);

export default router;