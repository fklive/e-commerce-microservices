import { Router } from 'express';
import { AddressController } from '../controllers/address-controller';
import { authMiddleware } from '../middleware/auth-middleware';


const router = Router();
const addressController = new AddressController();

router.post('/', authMiddleware, addressController.saveAddress);

export default router;