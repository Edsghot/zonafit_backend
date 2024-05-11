import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MembershipEntity } from './membership.entity';
import { PaymentEntity } from './Payment.entity';

@Entity("Client")
export class ClientEntity {
    @PrimaryGeneratedColumn()
    IdClient: number;

    @OneToMany(() => PaymentEntity, payment => payment.Client)
    Payment: PaymentEntity[];
    
    @Column()
    Code: string;

    @Column()
    FirstName: string;

    @Column()
    LastName: string;

    @Column()
    PhoneNumber: string;

    @Column()
    Document: string;

    @Column()
    DocumentType: string;

    @Column()
    MaritalStatus: string;

    @Column()
    Gender: string;

    @Column()
    Address: string;

    @Column()
    Whatsapp: string;

    @Column()
    Mail: string;

    @Column()
    BirthDate: Date;

    @Column()
    Note: string;

    @Column()
    Image: string;
}
