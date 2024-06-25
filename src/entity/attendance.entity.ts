import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ClientEntity } from "./client.entity";
import { UserEntity } from "./user.entity";

@Entity("Attendance")
export class AttendanceEntity {
    @PrimaryGeneratedColumn()
    IdAttendance: number;

    @OneToOne(() => ClientEntity)
    @JoinColumn({name:"idClient"})
    Client: ClientEntity;

    @OneToOne(() => UserEntity)
    @JoinColumn({name:"idUser"})
    User: UserEntity;

    @Column()
    AttendanceDate:Date;
}