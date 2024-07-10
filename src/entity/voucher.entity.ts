import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ClientEntity } from './client.entity';

@Entity('Vaucher')
export class VaucherEntity {
  @PrimaryGeneratedColumn()
  VoucherId: number;

  @Column()
  idClient: number;

  @Column()
  code: string;

  @Column('float')
  amount: number;

  @Column()
  expirationDate: Date;

  @Column()
  isActive: boolean;

  @Column()
  dateRegister: Date;
}