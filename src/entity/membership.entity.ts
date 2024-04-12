import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity("Membreship")
export class MembershipEntity {
    @PrimaryGeneratedColumn()
    idMembership: number;

    @Column()
    idUser: number;

    @Column()
    idClient: number;

    @Column()
    idPayment: number;
    
    @Column()
    startDate: string;

    @Column()
    endDate: string;

    @Column()
    price: string;

    @Column()
    discount: string;

    @Column()
    type: number;

    @Column()
    contract: boolean;

    @Column()
    observation: string;
}
