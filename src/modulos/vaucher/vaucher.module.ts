import { Module } from '@nestjs/common';
import { VaucherService } from './vaucher.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VaucherEntity } from 'src/entity/voucher.entity';
import { VoucherController } from './vaucher.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VaucherEntity])],
  providers: [VaucherService],
  controllers: [VoucherController],
})
export class VaucherModule {}
