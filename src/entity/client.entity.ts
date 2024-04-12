import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity("Client")
export class ClientEntity {
    @PrimaryGeneratedColumn()
    IdUser: number;

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
    Department: string;

    @Column()
    Province: string;

    @Column()
    District: string;

    @Column()
    Whatsapp: string;

    @Column()
    Email: string;
}
