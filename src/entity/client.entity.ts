import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MembershipEntity } from './membership.entity';

@Entity("Client")
export class ClientEntity {
    @PrimaryGeneratedColumn()
    IdClient: number;

    @OneToMany(() => MembershipEntity, membreship => membreship.Client)
    Membreship: MembershipEntity[];
    
    @Column()
    Code: string;

    @Column()
    Username: string;

    @Column()
    FirstName: string;

    @Column()
    LastName: string;

    @Column()
    PhoneNumber: string;

    @Column()
    Document: string;

    @Column()
    DocumentType: string;

    @Column()
    MaritalStatus: string;

    @Column()
    Gender: string;

    @Column()
    Address: string;

    @Column()
    Whatsapp: string;

    @Column()
    Mail: string;

    @Column()
    BirthDate: Date;
}
