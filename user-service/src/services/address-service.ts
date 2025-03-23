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
                throw new Error('Bir kullanıcı en fazla 5 adres kaydedebilir');
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
                throw new Error('Geçersiz kullanıcı ID');
            }
            //23505: Postgres duplicate violation
            if (error.code === '23505') {
                throw new Error('Bu adres zaten kaydedilmiş');
            }

            console.error('Veritabanı hatası:', error);
            throw new Error('Adres kaydedilirken veritabanı hatası oluştu');
        }

    }

}