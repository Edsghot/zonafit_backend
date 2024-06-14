import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}