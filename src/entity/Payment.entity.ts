import { Entity, PrimaryGeneratedColumn, Column, Double, ManyToOne } from 'typeorm';
import { MembershipEntity } from './membership.entity';

@Entity("Payment")
export class PaymentEntity {
    @PrimaryGeneratedColumn()
    PaymentId: number;

    @ManyToOne(() => MembershipEntity, membership => membership.Payment)
    Membership: MembershipEntity;

    @Column({type: 'double'})
    Total: number;

    @Column({type: 'double'})
    RemainingAmount: number;

    @Column()
    PaymentDate: Date;

    @Column()
    State: boolean;

    @Column()
    PaymentMethod: number;

    @Column()
    VoucherNumber: number;
    
    @Column()
    PaymentReceipt: number;

    @Column()
    Number: string;

    @Column()
    Observation: string;
}

