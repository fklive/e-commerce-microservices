import { Request, Response } from 'express';
import { UserService } from '../services/user-service';
import { AddressService } from '../services/address-service';
import { generateToken } from '../utils/jwt';
import { User } from '../models/user.entity';


export class AddressController {

    private userService : UserService;
    private addressService: AddressService;

    constructor() {
        this.userService = new UserService();
        this.addressService = new AddressService();
    }

}