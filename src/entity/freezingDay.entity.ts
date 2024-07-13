import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PaymentEntity } from "./Payment.entity";

@Entity("freezingDay")
export class FreezingDayEntity{
    @PrimaryGeneratedColumn()
    IdFreezingDay: number;

    @ManyToOne(() => PaymentEntity, payment => payment.FreezingDay)
    Payment: PaymentEntity;

    @Column()
    NumberOfDay:number;

    @Column()
    Frozen:boolean;

    @Column()
    FrozenDate:Date;

    @Column()
    DateRegister:Date;
}