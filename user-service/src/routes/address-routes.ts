import { Router } from 'express';
import { AddressController } from '../controllers/address-controller';


const router = Router();
const addressController = new AddressController();


export default router;