import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity("User")
export class UserEntity {
    @PrimaryGeneratedColumn()
    IdUser: number;

    @Column()
    Code: string;
    
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
    Email: string;
}
