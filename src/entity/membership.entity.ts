import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { ClientEntity } from './client.entity';
import { PaymentEntity } from './Payment.entity';
@Entity("Membreship")
export class MembershipEntity {
    @PrimaryGeneratedColumn()
    idMembership: number;

    @ManyToOne(() => UserEntity, user => user.Membreship)
    User: UserEntity;

    @ManyToOne(() => ClientEntity, client => client.Membreship)
    Client: ClientEntity;

    @OneToMany(() => PaymentEntity, payment => payment.Membership)
    Payment: PaymentEntity[];
    
    @Column()
    startDate: string;

    @Column()
    endDate: string;

    @Column()
    price: string;

    @Column()
    discount: string;

    @Column()
    type: number;

    @Column()
    observation: string;
}
