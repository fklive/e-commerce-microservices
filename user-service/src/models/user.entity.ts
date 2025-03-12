import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Address } from './address.entity';


export enum UserRole{
    ADMIN = "admin",
    GUEST = "guest",
    CUSTOMER = "customer"
}

@Entity('users')
export class User{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => Address, address => address.user)
    addresses: Address[];

    @Column({ unique: true })
    email: string;
  
    //this field is encrypted before the storage
    @Column()
    password: string;

    @Column({name: 'first_name'})
    firstName: string;

    @Column({name: 'last_name'})
    lastName: string;

    @Column({name: 'phone_number'})
    phoneNumber: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column({name: 'role',enum: UserRole, default: UserRole.GUEST})
    role: UserRole
}

