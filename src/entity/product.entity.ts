import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { CartEntity } from "./Carrito.entity";

export enum TypeProduct {
    Wisky = 0,
    Rones = 1,
    Pisco = 2,
    vino = 3,
    vodka = 4,
    otros = 999
}

@Entity({name:'Product'})
export class ProductEntity{
    @PrimaryGeneratedColumn()
    IdProduct:number;

    @Column()
    Name:String;

    @Column()
    Description:String;

    @Column()
    Image:String;
    
    @Column({type:'double'})
    Price:number

    @Column({type:'double'})
    PurchasePrice:number;

    @Column()
    Type:TypeProduct;

    @Column()
    Stock:number;

    @Column()
    Deleted:boolean;

    @ManyToMany(() => CartEntity, cart => cart.products)
    Carts: CartEntity[];
}