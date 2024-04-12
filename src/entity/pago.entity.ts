import { Entity, PrimaryGeneratedColumn, Column, Double } from 'typeorm';

@Entity("Pago")
export class PagoEntity {
    @PrimaryGeneratedColumn()
    IdPago: number;

    @Column({type: 'double'})
    Total: number;

    @Column({type: 'double'})
    Restante: number;

    @Column()
    fechaPago: Date;

    @Column()
    State: Boolean;

    @Column()
    FormaPago: number;

    @Column()
    NroBoucher: number;
    
    @Column()
    ComprobantePago: number;

    @Column()
    Numero: string;

    @Column()
    Observacion: string;

}
