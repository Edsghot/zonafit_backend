import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from 'src/dto/productDto/CreateProductDto.dto';
import { ProductEntity } from 'src/entity/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
      ) {}

      async insertProduct(request: CreateProductDto) {
        try {

            var product = await this.productRepository.findOne({where:{Name: request.Name,Deleted: false}});

            if(product) {
                return {msg:"Ya existe un producto con ese nombre, solo aumente el stock", success: false};
            }

            const newProduct = new ProductEntity();

            newProduct.Name = request.Name;
            newProduct.Description = request.Description;
            newProduct.Image = request.Image;
            newProduct.Price = request.Price;
            newProduct.PurchasePrice = request.PurchasePrice;
            newProduct.Type = request.Type;
            newProduct.Stock=request.Stock;
            newProduct.Deleted = false;

            await this.productRepository.save(newProduct);
    
            return { msg: 'Producto insertado correctamente', success: true };
        } catch (error) {
            console.error('Fallo al insertar el producto:', error);
            return { msg: 'Fallo al insertar el producto', detailMsg: error, success: false };
        }
    }

    async getAllProducts() {
        try {
            const products = await this.productRepository.find({where: {Deleted: false}});
            return { msg: 'Productos encontrados', success: true, data: products };
        } catch (error) {
            console.error('Fallo al obtener los productos:', error);
            return { msg: 'Fallo al obtener los productos', detailMsg: error, success: false };
        }
    }
    
    async getProductById(id: number) {
        try {
            const product = await this.productRepository.findOne({ where: { IdProduct: id,Deleted: false } });
            if (!product) {
                throw new NotFoundException(`Producto con el ID ${id} no encontrado`);
            }
            return { msg: 'Producto encontrado', success: true, data: product };
        } catch (error) {
            console.error('Fallo al obtener el producto por ID:', error);
            return { msg: 'Fallo al obtener el producto por ID', detailMsg: error, success: false };
        }
    }

    async deleteProduct(id: number) {
        try {
            var product = await this.productRepository.findOne({where: {IdProduct:id}});
            if(!product) {
                return {msg:"Error no se encontro el producto",success: false}
            }
            product.Deleted = true;
            await this.productRepository.save(product);
            return { msg: 'Producto eliminado correctamente', success: true };
        } catch (error) {
            console.error('Fallo al eliminar el producto:', error);
            return { msg: 'Fallo al eliminar el producto', detailMsg: error, success: false };
        }
    }

  

    async updateProduct(id: number, request: CreateProductDto) {
        try {
            const product = await this.productRepository.findOne({ where: { IdProduct: id ,Deleted: false} });
            if (!product) {
                return { msg: 'Producto no se encuentra', success: false };
            }
    
            product.Name = request.Name;
            product.Description = request.Description;
            product.Image = request.Image;
            product.Price = request.Price;
            product.PurchasePrice = request.PurchasePrice;
            product.Type = request.Type;
            product.Stock=request.Stock;
    
            await this.productRepository.save(product);
    
            return {
                msg: 'Producto actualizado correctamente',
                success: true,
                data: product,
            };
        } catch (error) {
            console.error('Fallo al actualizar el producto:', error);
            return { msg: 'Fallo al actualizar el producto', detailMsg: error, success: false };
        }
    }
    
}
