import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ClientEntity } from './client.entity';

@Entity('Vaucher')
export class VaucherEntity {
  @PrimaryGeneratedColumn()
  VoucherId: number;

  @Column()
  IdClient: number;

  @Column()
  Code: number;

  @Column('float')
  Amount: number;

  @Column()
  Description: string;

  @Column()
  DateRegister: Date;

  @Column()
  TypePayment: string;

  @Column()
  IdUser: number;
}