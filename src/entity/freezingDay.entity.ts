import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PaymentEntity } from "./Payment.entity";

@Entity("freezingDay")
export class FreezingDayEntity{
    @PrimaryGeneratedColumn()
    IdFreezingDay: number;

    @OneToOne(() => PaymentEntity)
    @JoinColumn({name:"idPayment"})
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