import { Module } from '@nestjs/common';
import { FreezingDayController } from './freezing-day.controller';
import { FreezingDayService } from './freezing-day.service';
import { FreezingDayEntity } from 'src/entity/freezingDay.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from 'src/entity/Payment.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([FreezingDayEntity]),TypeOrmModule.forFeature([PaymentEntity])
  ],
  controllers: [FreezingDayController],
  providers: [FreezingDayService]
})
export class FreezingDayModule {}
