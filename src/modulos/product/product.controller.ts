import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from 'src/dto/productDto/CreateProductDto.dto';
import { CloudinaryService } from 'src/services/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FOLDER_PRODUCTOS } from 'src/Config/constantService';

@Controller('api/product')
export class ProductController {

    constructor (private productService: ProductService,
        private cloudinaryService: CloudinaryService,){}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async insert(
      @Body() createProductDto: CreateProductDto,
      @UploadedFile() file?: Express.Multer.File){
        var res = await this.cloudinaryService.uploadFile(file, FOLDER_PRODUCTOS);

        createProductDto.Image = res.secure_url;

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
