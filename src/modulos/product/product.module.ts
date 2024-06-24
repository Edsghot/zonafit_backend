import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductEntity } from 'src/entity/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/services/cloudinary/cloudinary.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule,
    TypeOrmModule.forFeature([ProductEntity])],
  controllers: [ProductController],
  providers: [ProductService,CloudinaryService]
})
export class ProductModule {}
