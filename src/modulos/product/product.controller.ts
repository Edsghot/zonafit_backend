import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from 'src/dto/productDto/CreateProductDto.dto';

@Controller('api/product')
export class ProductController {

    constructor (private productService: ProductService){}

    @Post()
    async create(@Body() createProductDto: CreateProductDto) {
        return await this.productService.insertProduct(createProductDto);
    }

    @Get()
    async findAll() {
        return await this.productService.getAllProducts();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.productService.getProductById(+id);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.productService.deleteProduct(+id);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() updateProductDto: CreateProductDto) {
        return await this.productService.updateProduct(id, updateProductDto);
    }
}
