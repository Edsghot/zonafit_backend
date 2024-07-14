import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceEntity } from 'src/entity/attendance.entity';
import { ClientEntity } from 'src/entity/client.entity';
import { UserEntity } from 'src/entity/user.entity';
import { PaymentEntity } from 'src/entity/Payment.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([AttendanceEntity]),TypeOrmModule.forFeature([PaymentEntity]),TypeOrmModule.forFeature([ClientEntity]),TypeOrmModule.forFeature([UserEntity])
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService]
})
export class AttendanceModule {}
