import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipEntity } from 'src/entity/membership.entity';
import { UserEntity } from 'src/entity/user.entity';
import { ClientEntity } from 'src/entity/client.entity';
import { PaymentEntity } from 'src/entity/Payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),TypeOrmModule.forFeature([MembershipEntity]),TypeOrmModule.forFeature([ClientEntity]),TypeOrmModule.forFeature([PaymentEntity])],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule {}
