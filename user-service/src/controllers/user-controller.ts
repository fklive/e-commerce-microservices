import { Request, Response } from 'express';
import { UserService } from '../services/user-service';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  register = async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, password, firstName, lastName, phoneNumber } = req.body;

      // Gerekli alanların kontrolü
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ 
          success: false, 
          message: 'All fields are required' 
        });
      }

      // Kullanıcı oluşturma
      const user = await this.userService.createUser({
        email,
        password,
        firstName,
        lastName,
        phoneNumber: phoneNumber || ''
      });

      // Hassas verileri çıkarma
      const { password: _, ...userWithoutPassword } = user;

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: userWithoutPassword
      });
    } catch (error) {
      console.error('Register error:', error);
      
      if (error.message === 'Email already in use') {
        return res.status(409).json({
          success: false,
          message: 'Email already in use'
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
}