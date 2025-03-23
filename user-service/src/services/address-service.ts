import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Address, AddressType } from '../models/address.entity';

export class AddressService {

    private addressRepository: Repository<Address>;

    constructor() {
        this.addressRepository = AppDataSource.getRepository(Address);
    }

    async saveAddress(addressData: {
        userId: string,
        street: string,
        city: string,
        country: string,
        postalCode: string,
        isDefault: boolean,
        addressType: AddressType

    }): Promise<Address> {
        try {
            const existingAddresses = await this.addressRepository.count({
                where: { userId: addressData.userId }
            });

            if (existingAddresses >= 5) {
                throw new Error('Limit error!One user can saved 5 address maxiumum.');
            }

            const address = this.addressRepository.create(addressData);

            if (addressData.isDefault) {
                await this.addressRepository.update(
                    { userId: addressData.userId, isDefault: true },
                    { isDefault: false }
                );
            }
            return await this.addressRepository.save(address);

        }
        catch (error) {
            //23503 :Postgres foreign key violation
            if (error.code === '23503') {
                throw new Error("Unvalid user id");
            }
            //23505: Postgres duplicate violation
            if (error.code === '23505') {
                throw new Error('This address is already saved.');
            }

            console.error('Database error:', error);
            throw new Error('Error while address saved.');
        }

    }

    async getAddressesByUserId(userId: string): Promise<Address[]> {

        try {
            const addresses = await this.addressRepository.find({ where: { userId } });
            return addresses;
        }
        catch (error) {

            console.error('Database error:', error);
            throw new Error('Error while address saved.');
        }

    }

    async getAddressesById(userId: string, addressId: string): Promise<Address> {
       try{

        const address = await this.addressRepository.findOne({
            where: {
              id: addressId,
              userId: userId  
            }
          });
        
        if(!address)
        throw new Error("Can't find the address for this user.")

        return address;

       }  catch (error) {

        console.error('Database error:', error);
        throw new Error('Error while address saved.');
    } 
    }

}