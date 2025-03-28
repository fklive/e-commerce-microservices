import { Router } from 'express';
import { AddressController } from '../controllers/address-controller';
import { authMiddleware } from '../middleware/auth-middleware';


const router = Router();
const addressController = new AddressController();

router.post('/', authMiddleware, addressController.saveAddress);
router.get('/', authMiddleware, addressController.getAddress);
router.get('/:id',authMiddleware,addressController.getAddressById);
router.patch('/:id',authMiddleware,addressController.updateAddress);
router.delete('/:id',authMiddleware,addressController.deleteAddressById);

export default router;