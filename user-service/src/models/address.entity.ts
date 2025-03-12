import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

export enum AddressType{
    DELIVERY = "delivery",
    BILL = "bill"
}

@Entity('address')
export class Address{
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({name: "user_id"})
    userId: string;

    @ManyToOne(() => User, user => user.addresses)
    @JoinColumn({name: "user_id"}) 
    user: User;

    @Column({name: "address_type", enum: AddressType, default: AddressType.DELIVERY})
    type: AddressType;

    @Column({name: "street"})
    street: string;

    @Column({name: "city"})
    city: string;

    @Column({name: "country"})
    country: string;
    
    @Column({name: "postal_code"})
    postalCode: string;

    @Column({name: "is_default"})
    isDefault: boolean

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

}

