import { Request, Response } from 'express';
import { AddressService } from '../services/address-service';
import { User } from '../models/user.entity';
import { Address, AddressType } from '../models/address.entity';


export class AddressController {

    private addressService: AddressService;

    constructor() {
        this.addressService = new AddressService();
    }

    saveAddress = async (req: Request, res: Response) : Promise<any> => {
     
     try{
        const { street, city, country, postalCode, isDefault, addressType } = req.body;
        const userId = req.user.userId; 

        if (!street || !city || !country) {
            return res.status(400).json({
              success: false,
              message: 'Street, city ve country alanları zorunludur'
            });
          }

      const address = await this.addressService.saveAddress({
        userId,
        street,
        city,
        country,
        postalCode,
        isDefault: isDefault === undefined ? true : isDefault,
        addressType: addressType || AddressType.DELIVERY
      });

      const {userId: _ , ...addressWithoutSensitiveInformation} = address

      return res.status(201).json({
        success: true,
        message: 'Adres başarı ile kaydedildi',
        data: addressWithoutSensitiveInformation
      });
     }
     catch(error){
        console.log("Adres kaydetme hatası",error);

        if (error.message.includes("foreign key constraint")) {
            return res.status(400).json({
              success: false,
              message: 'Geçersiz kullanıcı ID'
            });
          }

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
          });
     }
    }

}