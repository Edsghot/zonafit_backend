import { Module } from '@nestjs/common';
import { VaucherService } from './vaucher.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VaucherEntity } from 'src/entity/voucher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VaucherEntity])],
  providers: [VaucherService],
  exports: [VaucherService],
})
export class VaucherModule {}
