import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PaymentEntity } from "./Payment.entity";

@Entity("freezingDay")
export class FreezingDayEntity{
    @PrimaryGeneratedColumn()
    IdFreezingDay: number;

    @OneToMany(() => PaymentEntity, payment => payment.Membership)
    Payment: PaymentEntity[];

    @Column()
    NumberOfDay:number;

    @Column()
    Frozen:boolean;

    @Column()
    FrozenDate:Date;

    @Column()
    DateRegister:Date;
}