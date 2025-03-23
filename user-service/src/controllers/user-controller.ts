import { Request, Response } from 'express';
import { UserService } from '../services/user-service';
import { generateToken } from '../utils/jwt';
import { User } from '../models/user.entity';

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
          message: 'Email , password and name spaces must be valid.' 
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

  login = async (req: Request, res: Response): Promise<any> => {
    try{
      const{email,password} = req.body;

      if(!email || !password)
      {
        return res.status(400).json({
          success: false,
          message: 'Tüm alanlar dolu olmalı.'
        });
            }

      const user = await this.userService.login({email,password});
      const { password: _, ...userWithoutPassword } = user;

      const token = generateToken(user);

      return res.status(200).json({
        success: true,
        message: 'User registered successfully',
        token: token,
        data: userWithoutPassword
      });
    }
    catch(error){
      console.error('Login hatası:', error);
      if (error.message === 'Kullanıcı bulunamadı.') {
        return res.status(404).json({
          success: false,
          message: 'Kullanıcı bulunamadı.'
        });
      }
      else if(error.message === "Geçersiz kullanıcı adı & şifre"){
        return res.status(401).json({
          success: false,
          message: "Geçersiz kullanıcı adı & şifre"
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };

    getProfile = async (req: Request, res: Response): Promise<any> => {
      try{
        const userId = req.user.userId;
  
        const userProfile = await this.userService.getUserById(userId);

        if(!userProfile){
          return res.status(404).json({
            success: false,
            message: "Can't find the user."
          });
        }

        const { password: _, ...userInfoWithoutPassword } = userProfile;
  
        return res.status(200).json({
          success: true,
          message: 'Profil bilgileri getirildi.',
          data: userInfoWithoutPassword
        });
        
      }
      catch(error){
        console.error("Can't get the profile info:", error);
        if (error.message === 'Kullanıcı profili bulunamadı.') {
          return res.status(404).json({
            success: false,
            message: "Can't find the user."
          });
        }
        return res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    }

    updateProfile = async (req: Request, res: Response) : Promise<any> => {
      try {
        const userId = req.user.userId; 
        const updateData = req.body;    
        
        // Güncellenebilir alanları belirle ve filtrele
        const allowedFields = ['firstName', 'lastName', 'phoneNumber'];
        
        const fieldsToUpdate: Partial<User> = {};
        
        allowedFields.forEach(field => {
          if (field in updateData) {
            fieldsToUpdate[field as keyof User] = updateData[field];
          }
        });
        
        // Güncellenecek alan yoksa hata dön
        if (Object.keys(fieldsToUpdate).length === 0) {
          return res.status(400).json({
            success: false,
            message: "Already updated."
          });
        }
        
        // Servis katmanını çağır
        const updatedUser = await this.userService.updateUserProfile(userId, fieldsToUpdate);
        
        // Hassas verileri çıkar
        const { password, ...userWithoutPassword } = updatedUser;
        
        return res.status(200).json({
          success: true,
          message: 'Successfully updated',
          data: userWithoutPassword
        });
        
      } catch (error) {
        console.error('Profile info update error:', error);
        
        if (error.message === "Can't find the user.") {
          return res.status(404).json({
            success: false,
            message: "Can't find the user."
          });
        }
        
        return res.status(500).json({
          success: false,
          message: 'Error while profile info updated.'
        });
      }
    }
}