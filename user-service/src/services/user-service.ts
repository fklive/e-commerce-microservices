import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User, UserRole } from '../models/user.entity';
import bcrypt from 'bcrypt';

export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async createUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role?: UserRole;
  }): Promise<User> {
    // E-posta kontrolü
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new Error('Email already in use');
    }

    // Şifreyi hash'leme
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Yeni kullanıcı oluşturma
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      role: userData.role || UserRole.CUSTOMER
    });

    // Kullanıcıyı kaydetme
    return await this.userRepository.save(user);
  }
}