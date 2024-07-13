import { Entity, PrimaryGeneratedColumn, Column, Double, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { MembershipEntity } from './membership.entity';
import { ClientEntity } from './client.entity';
import { UserEntity } from './user.entity';
import { FreezingDayEntity } from './freezingDay.entity';

@Entity("Payment")
export class PaymentEntity {
    @PrimaryGeneratedColumn()
    PaymentId: number;

    @ManyToOne(() => ClientEntity, client => client.Payment)
    Client: ClientEntity;

    @ManyToOne(() => MembershipEntity, Membership => Membership.Payment)
    Membership: MembershipEntity;

    @ManyToOne(() => UserEntity, user => user.Payment)
    User: UserEntity;
    
    @OneToMany(() => FreezingDayEntity, freezing => freezing.Payment)
    FreezingDay: FreezingDayEntity[];

    @Column()
    StartDate: Date;

    @Column()
    EndDate: Date;

    @Column({type:'float'})
    Total: number;


    @Column({type:'float'})
    Discount: number;

    @Column({type:'float'})
    PriceDiscount: number;

    @Column({type:'float'})
    QuantityDays: number;

    @Column()
    DatePayment: Date;

    @Column({type:'float'})
    Due: number;
    
    @Column({type: 'float'})
    PrePaid: number;

    @Column()
    PaymentType: string;

    @Column()
    PaymentReceipt: string;

    @Column()
    Observation: string;

    @Column()
    DateRegister:Date;
}

