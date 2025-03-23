import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User, UserRole } from '../models/user.entity';
import { Address, AddressType } from '../models/address.entity';
import bcrypt from 'bcrypt';


export class AddressService {

    private userRepository: Repository<User>;
    private addressRepository: Repository<Address>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
        this.addressRepository = AppDataSource.getRepository(Address);

    }


}