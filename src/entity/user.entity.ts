import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MembershipEntity } from './membership.entity';

@Entity("User")
export class UserEntity {
    @PrimaryGeneratedColumn()
    IdUser: number;

    @Column()
    Code: string;

    @OneToMany(() => MembershipEntity, membreship => membreship.User)
    Membreship: MembershipEntity[];
    
    @Column()
    Username: string;

    @Column()
    Password: string;

    @Column()
    FirstName: string;

    @Column()
    LastName: string;

    @Column()
    PhoneNumber: string;

    @Column()
    Dni: string;

    @Column()
    Access: boolean;

    @Column()
    RoleId: number;

    @Column()
    Mail: string;

    @Column({ type: 'date' })
    BirthDate: Date;

    @Column()
    Image: string;
}
