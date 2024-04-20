import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { ClientEntity } from './client.entity';
import { PaymentEntity } from './Payment.entity';
@Entity("Membreship")
export class MembershipEntity {
    @PrimaryGeneratedColumn()
    IdMembership: number;

    @ManyToOne(() => UserEntity, user => user.Membreship)
    User: UserEntity;

    @ManyToOne(() => ClientEntity, client => client.Membreship)
    Client: ClientEntity;

    @OneToMany(() => PaymentEntity, payment => payment.Membership)
    Payment: PaymentEntity[];
    
    @Column()
    StartDate: string;

    @Column()
    EndDate: string;

    @Column()
    Price: string;

    @Column()
    discount: string;

    @Column()
    Type: number;

    @Column()
    Observation: string;
}
