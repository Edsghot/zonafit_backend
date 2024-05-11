import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PaymentEntity } from './Payment.entity';
@Entity("Membreship")
export class MembershipEntity {
    @PrimaryGeneratedColumn()
    IdMembership: number;

    @Column()
    Name:string;

    @Column({type:'float'})
    Price:number;

    @Column()
    Time: number;

    @Column()
    Enabled: boolean;

    @OneToMany(() => PaymentEntity, payment => payment.Membership)
    Payment: PaymentEntity[];
    
}
