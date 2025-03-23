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
              message: 'Street, city and country field must be valid.'
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
        message: 'Address info saved successfully.',
        data: addressWithoutSensitiveInformation
      });
     }
     catch(error){
        console.log("Transaction error.Can't save the address:",error);

        if (error.message.includes("foreign key constraint")) {
            return res.status(400).json({
              success: false,
              message: 'Unvalid user.'
            });
          }

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
          });
     }
    }

    getAddress = async(req: Request, res: Response) : Promise<any> => {
    
        try{
            const userId = req.user.userId; 

            const addresses = await this.addressService.getAddressesByUserId(userId);


            return res.status(200).json({
                success: true,
                message: 'Process work successfully.',
                data: addresses
              });
        }
        catch(error)
        {
         console.log("Transaction error.Can't find the address",error);


        return res.status(500).json({
            success: false,
            message: 'Internal server error'
          });
        }
    }

    getAddressById = async(req: Request, res: Response) : Promise<any> => {
        try{
            const userId = req.user.userId;
            const addressId = req.params.id;

            const addressById = await this.addressService.getAddressesById(userId,addressId);

            return res.status(200).json({
                success: true,
                message: 'Process work successfully.',
                data: addressById
              });
        }
        catch(error)
        {
         console.log("Transaction error.Can't find the address",error);
        
         if(error.message === "Can't find the address for this user.")
         {
            return res.status(404).json({
                success: false,
                message: "Can't find address for this user."
              });
         }

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
          });
        }
    }

    deleteAddressById = async(req: Request, res: Response) :Promise<any> => {
        try{
            const userId = req.user.userId;
            const addressId = req.params.id;

            const deletedAddress = await this.addressService.deleteAddressById(userId,addressId);

            return res.status(200).json({
                success: true,
                message: 'Address successfully deleted.',
                data: deletedAddress
              });
        }
        catch(error)
        {
            console.log("Transaction error.Can't delete the address",error);
        
            if(error.message === "Can't delete the address for this user.")
            {
               return res.status(404).json({
                   success: false,
                   message: "Can't delete address for this user."
                 });
            }
   
           return res.status(500).json({
               success: false,
               message: 'Internal server error'
             });
        }
    }

}