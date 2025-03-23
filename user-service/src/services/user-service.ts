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
    try {


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
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('Email already in use');
      }
      console.error('Database error:', error);
      throw new Error('Error while user created');
    }

  }

  async login(userData: {
    email: string;
    password: string;
  }): Promise<User> {

    const user = await this.userRepository.findOne({ where: { email: userData.email } });
    if (!user) {
      throw new Error("Can't find user");
    }

    const isMatch = bcrypt.compareSync(userData.password, user.password);
    if (!isMatch) {
      throw new Error("Unvalid username or password");
    }
    return user;
  }

  async getUserById(userId: string): Promise<User> {

    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new Error("User profile can't find.");
    }
    return user;

  }

  async updateUserProfile(userId: string, updateData: Partial<User>): Promise<User> {

    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new Error("Can't find user");
    }

    // Kullanıcı nesnesini güncellenecek verilerle birleştir
    const updatedUser = { ...user, ...updateData };

    return await this.userRepository.save(updatedUser);
  }
}