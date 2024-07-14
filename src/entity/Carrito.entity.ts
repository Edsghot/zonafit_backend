import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { ProductEntity } from "./product.entity";

@Entity('Cart')
export class CartEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  price: number;

  @ManyToMany(() => ProductEntity, product => product.Carts)
  @JoinTable()
  products: ProductEntity[];

  @Column()
  Quantity: number[];

  @Column()
  IdUser: number;

  @Column()
  CreateAt: Date;

  @Column()
  TypePayment:string; 
}