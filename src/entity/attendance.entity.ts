import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ClientEntity } from "./client.entity";
import { UserEntity } from "./user.entity";
@Entity("Attendance")
export class AttendanceEntity {
    @PrimaryGeneratedColumn()
    IdAttendance: number;

    @ManyToOne(() => ClientEntity)
    @JoinColumn({ name: "IdClient" })
    Client: ClientEntity;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: "IdUser" })
    User: UserEntity;

    @Column()
    AttendanceDate: Date;
}