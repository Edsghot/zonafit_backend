import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MembershipEntity } from './membership.entity';
import { PaymentEntity } from './Payment.entity';

@Entity("User")
export class UserEntity {
    @PrimaryGeneratedColumn()
    IdUser: number;

    @Column()
    Code: string;

    @OneToMany(() => PaymentEntity, payment => payment.User)
    Payment: PaymentEntity[];

    @Column()
    UserName: string;

    @Column()
    Password: string;

    @Column()
    FirstName: string;

    @Column()
    LastName: string;

    @Column()
    PhoneNumber: string;

    @Column()
    Dni: string;

    @Column()
    Access: boolean;

    @Column()
    RoleId: number;

    @Column()
    Mail: string;

    @Column({ type: 'date' })
    BirthDate: Date;

    @Column()
    Image: string;
}
