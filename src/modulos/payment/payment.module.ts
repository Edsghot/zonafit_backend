import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipEntity } from 'src/entity/membership.entity';
import { UserEntity } from 'src/entity/user.entity';
import { ClientEntity } from 'src/entity/client.entity';
import { PaymentEntity } from 'src/entity/Payment.entity';
import { VaucherService } from '../vaucher/vaucher.service';
import { VaucherEntity } from 'src/entity/voucher.entity';
import { CartEntity } from 'src/entity/Carrito.entity';
import { ProductEntity } from 'src/entity/product.entity';
import { FreezingDayEntity } from 'src/entity/freezingDay.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity]),TypeOrmModule.forFeature([FreezingDayEntity]),TypeOrmModule.forFeature([ProductEntity]),
    TypeOrmModule.forFeature([UserEntity]),TypeOrmModule.forFeature([VaucherEntity]),TypeOrmModule.forFeature([MembershipEntity]),TypeOrmModule.forFeature([ClientEntity]),TypeOrmModule.forFeature([PaymentEntity])],
  controllers: [PaymentController],
  providers: [PaymentService,VaucherService]
})
export class PaymentModule {}
