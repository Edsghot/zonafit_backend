import { Module } from '@nestjs/common';
import { VaucherService } from './vaucher.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VaucherEntity } from 'src/entity/voucher.entity';
import { VoucherController } from './vaucher.controller';
import { ClientEntity } from 'src/entity/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VaucherEntity]),TypeOrmModule.forFeature([ClientEntity])],
  providers: [VaucherService],
  controllers: [VoucherController],
})
export class VaucherModule {}
